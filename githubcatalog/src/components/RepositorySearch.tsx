import React, { useState } from 'react';
import { TextField, Box, Stack, FormControlLabel, Typography, Chip, Link } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORIES_FILTERED, GET_USER_REPOSITORIES, GET_USERNAMES } from '../graphql/queries';
import RepositoryTable from './RepositoryTable';
import GithubLanguageFilter from '../stories/GithubLanguageFilter/GithubLanguageFilter';
import useDebounce from '../hooks/useDebounce';
import { buildSearchQuery } from '../utils/shared';
import GithubSearch from '../stories/GithubSearch/GithubSearch';
import GithubSwitch from '../stories/GithubSwitch/GithubSwitch';
import { useIntl } from 'react-intl';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { LANGUAGE_COLORS } from '../utils/constants';

const RepositorySearch = () => {
  const intl = useIntl();
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [count, setCount] = useState(0);
  const [includeForks, setIncludeForks] = useState(false);
  const [cursors, setCursors] = useState<string[]>([]);
  const [repoError, setRepoError] = useState<string | null>(null);


  const [fetchRepositories, { loading: repoLoading }] = useLazyQuery(GET_USER_REPOSITORIES, {
    onCompleted: (data) => {
      setRepositories(data?.user?.repositories?.edges || []);
      setEndCursor(data?.user?.repositories?.pageInfo?.endCursor || null);
      setCount(data?.user?.repositories?.totalCount || 0);
      setRepoError(null);
    },
    onError: (error) => {
      setRepoError(error.message);
    },
  });

  const [fetchFilteredRepositories, { loading: filteredLoading }] = useLazyQuery(GET_REPOSITORIES_FILTERED, {
    onCompleted: (data) => {
      setRepositories(data.search.edges);
      setEndCursor(data.search.pageInfo.endCursor);
      setCount(data.search.repositoryCount);
      setRepoError(null);
    },
    onError: (error) => {
      setRepoError(error.message);
    },
  });

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username);
    setPage(0); // Reset page
    setCursors([]); // Clear the previous cursors
    setEndCursor(null); // Reset the endCursor
    setRepositories([]);
    setCount(0); // Reset total count

    if (includeForks) {
      fetchRepositories({ variables: { username, first: rowsPerPage, after: null } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(username, nameFilter, languageFilter), first: rowsPerPage, after: null } });
    }
  };

  const handleChangePage = (newPage: number) => {
    if (!selectedUsername) return;

    let cursor = null;

    if (newPage > page) {
      // Moving forward to the next page
      cursor = endCursor;
      if (endCursor) {
        setCursors((prev) => [...prev, endCursor]);
      }
    } else if (newPage < page) {
      // Moving backward to the previous page
      cursor = cursors[cursors.length - 2] || null; // Use the second-last cursor for going back
      setCursors((prev) => prev.slice(0, -1)); // Remove the last cursor when going backward
    }

    setPage(newPage);

    if (includeForks) {
      fetchRepositories({ variables: { username: selectedUsername, first: rowsPerPage, after: cursor } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(selectedUsername, nameFilter, languageFilter), first: rowsPerPage, after: cursor } });
    }
  };


  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
    setPage(0);
    setCursors([]);
    setEndCursor(null);

    if (!selectedUsername) return;

    if (includeForks) {
      fetchRepositories({ variables: { username: selectedUsername, first: rowsPerPage, after: null } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(selectedUsername, nameFilter, languageFilter), first: rowsPerPage, after: null } });
    }
  };

  const updateTableData = (name?: string, languages?: string[], includeForks?: boolean) => {
    if (!selectedUsername) return;

    setPage(0);
    setEndCursor(null);
    setCursors([]);

    if (includeForks) {
      fetchRepositories({ variables: { username: selectedUsername, first: rowsPerPage, after: null } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(selectedUsername, name, languages), first: rowsPerPage, after: null } });
    }
  };

  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
    debouncedUpdateTableData(name, languageFilter);
  };

  const handleLanguageFilterChange = (languages: string[]) => {
    setLanguageFilter(languages);
    debouncedUpdateTableData(nameFilter, languages);
  };

  const debouncedUpdateTableData = useDebounce(updateTableData, 500);

  const handleIncludeForksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeForks(event.target.checked);
    setNameFilter('');
    setLanguageFilter([]);
    debouncedUpdateTableData('', [], event.target.checked);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: intl.formatMessage({
        id: 'githubcatalog.repositoryName',
        defaultMessage: 'Name',
      }),
      flex: 1,
      sortable: true,
    },
    {
      field: 'description',
      headerName: intl.formatMessage({
        id: 'githubcatalog.repositoryDescription',
        defaultMessage: 'Description',
      }),
      flex: 3,
      renderCell: (params: GridRenderCellParams) =>
        params.value || intl.formatMessage({
          id: 'githubcatalog.noDescription',
          defaultMessage: 'No description available',
        }),
    },
    {
      field: 'primaryLanguage',
      headerName: intl.formatMessage({
        id: 'githubcatalog.repositoryPrimaryLanguage',
        defaultMessage: 'Primary Language',
      }),
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <Chip
            label={params.value}
            style={{
              backgroundColor:
                LANGUAGE_COLORS[params.value as string] || '#ccc',
              color: 'white',
            }}
          />
        ) : (
          intl.formatMessage({
            id: 'githubcatalog.noLanguage',
            defaultMessage: 'N/A',
          })
        ),
    },
    {
      field: 'url',
      headerName: intl.formatMessage({
        id: 'githubcatalog.repositoryUrl',
        defaultMessage: 'URL',
      }),
      renderCell: (params: GridRenderCellParams) => (
        <Link href={params.value} target="_blank" rel="noopener noreferrer">
          <OpenInNewIcon />
        </Link>
      ),
    },
    ...(includeForks
      ? [
        {
          field: 'isFork',
          headerName: intl.formatMessage({
            id: 'githubcatalog.repositoryIsFork',
            defaultMessage: 'Is Fork',
          }),
          flex: 0.5,
          renderCell: (params: GridRenderCellParams) =>
            params.value
              ? intl.formatMessage({
                id: 'githubcatalog.yes',
                defaultMessage: 'Yes',
              })
              : intl.formatMessage({
                id: 'githubcatalog.no',
                defaultMessage: 'No',
              }),
        },
      ]
      : []),
  ];

  const rows = repositories.map((repo, index) => ({
    id: index,
    name: repo.node.name,
    description: repo.node.description,
    primaryLanguage: repo.node.primaryLanguage?.name,
    isFork: repo.node.isFork,
    url: repo.node.url
  }));

  return (
    <Box>
      <GithubSearch
        handleUsernameSelect={handleUsernameSelect}
        selectedUsername={selectedUsername}
      />
      {selectedUsername && (
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2} p={2} alignItems="flex-start">
            <TextField
              label={intl.formatMessage({ id: 'githubcatalog.repositoryNameFilter', defaultMessage: 'Filter by Repository Name' })}
              fullWidth
              value={nameFilter}
              onChange={(e) => handleNameFilterChange(e.target.value)}
              disabled={includeForks}
            />
            <GithubLanguageFilter
              onChange={handleLanguageFilterChange}
              disabled={includeForks}
            />
            <FormControlLabel
              control={<GithubSwitch sx={{ m: 1 }} defaultChecked={includeForks} onChange={handleIncludeForksChange} />}
              label={intl.formatMessage({ id: 'githubcatalog.includeForks', defaultMessage: 'Include forks' })}
              sx={{ whiteSpace: 'nowrap' }}
            />
          </Stack>
          {repoError ? (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              {repoError}
            </Typography>
          ) : (
            <RepositoryTable
              repositories={repositories}
              loading={repoLoading || filteredLoading}
              totalCount={count}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleRowsPerPageChange}
              columns={columns}
              rows={rows}
            />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default RepositorySearch;