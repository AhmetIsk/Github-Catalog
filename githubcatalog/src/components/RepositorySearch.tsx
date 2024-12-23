import React, { useState } from 'react';
import { TextField, Box, Stack, FormControlLabel, Typography, Chip, Link } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORIES_FILTERED, GET_USER_REPOSITORIES } from '../graphql/queries';
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

  /**
   * A lazy query hook that fetches user repositories.
   */
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

  /**
   * A lazy query hook that fetches filtered repositories.
   */
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

  /**
   * Handles the selection of a username.
   * @param username - The username to select.
   */
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

  /**
   * Handles the change of the page.
   * @param newPage - The new page number.
   */
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


  /**
   * Handles the change of the rows per page.
   * @param rowsPerPage - The new rows per page.
   */
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

  /**
   * Updates the table data.
   * @param name - The name to filter by.
   * @param languages - The languages to filter by.
   * @param includeForks - Whether to include forks.
   */
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

  /**
   * Handles the change of the name filter.
   * @param name - The new name filter.
   */
  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
    debouncedUpdateTableData(name, languageFilter);
  };

  /**
   * Handles the change of the language filter.
   * @param languages - The new language filter.
   */
  const handleLanguageFilterChange = (languages: string[]) => {
    setLanguageFilter(languages);
    debouncedUpdateTableData(nameFilter, languages);
  };

  /**
   * A debounced function that updates the table data.
   */
  const debouncedUpdateTableData = useDebounce(updateTableData, 500);

  /**
   * Handles the change of the include forks switch.
   * @param event - The event that triggered the change.
   */
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
              name="searchByRepositoryName"
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
                tableHeader={intl.formatMessage({
                  id: 'githubcatalog.repositoriesHeader',
                  defaultMessage: '{username}s Repositor{plural}',
                }, { username: selectedUsername, plural: rows.length > 1 ? 'ies' : 'y' })}
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