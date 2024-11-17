import React, { useState } from 'react';
import { Typography, CircularProgress, TextField, Box, Stack, FormControlLabel } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORIES_FILTERED, GET_USER_REPOSITORIES, GET_USERNAMES } from '../graphql/queries';
import RepositoryTable from './RepositoryTable';
import GithubLanguageFilter from '../stories/GithubLanguageFilter/GithubLanguageFilter';
import useDebounce from '../hooks/useDebounce';
import { buildSearchQuery } from '../utils/shared';
import GithubSearch from '../stories/GithubSearch/GithubSearch';
import GithubSwitch from '../stories/GithubSwitch/GithubSwitch';
import { useIntl } from 'react-intl';

const searchHeaderInitialStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'column',
};

const searchHeaderStyle = {
  ...searchHeaderInitialStyle,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

const RepositorySearch = () => {
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [repositories, setRepositories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [count, setCount] = useState(0);
  const [includeForks, setIncludeForks] = useState(false);
  const intl = useIntl();
  const [cursors, setCursors] = useState<string[]>([]); // Keep track of cursors

  const [fetchRepositories, { data, loading: repoLoading, error }] = useLazyQuery(GET_USER_REPOSITORIES, {
    onCompleted: (data) => {
      setRepositories(data?.user?.repositories?.edges || []);
      setEndCursor(data?.user?.repositories?.pageInfo?.endCursor || null);
      setCount(data?.user?.repositories?.totalCount || 0);
    },
  });

  const [fetchFilteredRepositories, { loading: filteredLoading }] = useLazyQuery(GET_REPOSITORIES_FILTERED, {
    onCompleted: (data) => {
      setRepositories(data.search.edges);
      setEndCursor(data.search.pageInfo.endCursor);
      setCount(data.search.repositoryCount);
    },
  });

  const [fetchUsers, { loading: usersLoading }] = useLazyQuery(GET_USERNAMES, {
    onCompleted: (data) => setUsers(data.search.nodes),
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

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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

  const handleInputChange = (event: any, value: string) => {
    setUsername(value);
    if (value.length > 2) {
      fetchUsers({ variables: { query: value } });
    } else {
      setUsers([]);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page
    setCursors([]); // Reset cursors
    setEndCursor(null); // Reset cursor

    if (!selectedUsername) return;

    if (includeForks) {
      fetchRepositories({ variables: { username: selectedUsername, first: newRowsPerPage, after: null } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(selectedUsername, nameFilter, languageFilter), first: newRowsPerPage, after: null } });
    }
  };

  const updateTableData = (name?: string, languages?: string[], includeForks?: boolean) => {
    if (!selectedUsername) return;

    setPage(0);
    setEndCursor(null); // Reset pagination cursor
    setCursors([]); // Reset cursors

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

  const debouncedUpdateTableData = useDebounce(updateTableData, 300);

  const handleIncludeForksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeForks(event.target.checked);
    setNameFilter('');
    setLanguageFilter([]);
    debouncedUpdateTableData('', [], event.target.checked);
  };

  return (
    <Box sx={!selectedUsername ? searchHeaderInitialStyle : searchHeaderStyle}>
      <GithubSearch
        handleUsernameSelect={handleUsernameSelect}
        handleInputChange={handleInputChange}
        users={users}
        usersLoading={usersLoading}
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

          {repoLoading || filteredLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{`Error: ${error.message}`}</Typography>
            ) :
              (
                <RepositoryTable
                  repositories={repositories}
                  loading={repoLoading || filteredLoading}
                  totalCount={count}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  includeForks={includeForks}
                />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default RepositorySearch;
