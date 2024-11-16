import React, { useState, useEffect } from 'react';
import { Typography, Container, CircularProgress, TextField, Autocomplete, Box, Stack, MenuItem } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORIES_FILTERED, GET_USER_REPOSITORIES, GET_USERNAMES } from '../graphql/queries';
import RepositoryTable from './RepositoryTable';
import GithubLanguageFilter from '../stories/GithubLanguageFilter/GithubLanguageFilter';
import useDebounce from '../hooks/useDebounce';

const buildSearchQuery = (username: string, nameFilter?: string, languageFilter?: string[]) => {
  let query = `user:${username}`;

  if (nameFilter) {
    query += ` ${nameFilter}`;
  }

  if (languageFilter && languageFilter.length > 0) {
    const languagesQuery = languageFilter.map(lang => `language:${lang}`).join(' ');
    query += ` ${languagesQuery}`;
  }

  return query;
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

  const [fetchRepositories, { data, loading: repoLoading, error }] = useLazyQuery(GET_USER_REPOSITORIES, {
    onCompleted: (data) => {
      setRepositories(data?.user?.repositories?.edges || []);
      setEndCursor(data?.user?.repositories?.pageInfo?.endCursor || null);
      setCount(data?.user?.repositories?.totalCount || 0);
    },
  });

  const [fetchFilteredRepositories, { data: filteredData, loading: filteredLoading }] = useLazyQuery(GET_REPOSITORIES_FILTERED, {
    onCompleted: (data) => {
      setRepositories(data.search.edges);
      setEndCursor(data.search.pageInfo.endCursor);
      setCount(data.search.totalCount);
    },
  });

  const [fetchUsers, { data: usersData, loading: usersLoading }] = useLazyQuery(GET_USERNAMES, {
    onCompleted: (data) => setUsers(data.search.nodes),
  });

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username);
    setPage(0);
    setRepositories([]);
    fetchRepositories({ variables: { username, first: rowsPerPage, after: null } });
  };

  const handleInputChange = (event: any, value: string) => {
    setUsername(value);
    if (value.length > 2) {
      fetchUsers({ variables: { query: value } });
    } else {
      setUsers([]);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const cursor = newPage > page ? endCursor : null;
    fetchRepositories({ variables: { username: selectedUsername, first: rowsPerPage, after: cursor } });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchRepositories({ variables: { username: selectedUsername, first: newRowsPerPage, after: null } });
  };

  const updateTableData = (name?: string, languages?: string[]) => {
    if (!selectedUsername) return;
    if (languages?.length === 0 && !name) {
      fetchRepositories({ variables: { username: selectedUsername, first: rowsPerPage, after: null } });
    } else {
      fetchFilteredRepositories({ variables: { query: buildSearchQuery(selectedUsername, name, languages), first: 10, after: null } });
    }
  }

  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
    debouncedUpdateTableData(name, languageFilter);
  };

  const handleLanguageFilterChange = (languages: string[]) => {
    setLanguageFilter(languages);
    debouncedUpdateTableData(nameFilter, languages);
  };

  const debouncedUpdateTableData = useDebounce(updateTableData, 300);

  return (
    <Container>
      <Stack spacing={2}>
        <Autocomplete
          freeSolo
          options={users}
          getOptionLabel={(option: any) => option.login}
          onInputChange={handleInputChange}
          onChange={(event, newValue) => handleUsernameSelect(newValue?.login || '')}
          loading={usersLoading}
          renderInput={(params) => <TextField {...params} label="Search for Username" />}
          disableClearable
        />
        {selectedUsername && (
          <>
            <TextField
              label="Filter by Repository Name"
              variant="outlined"
              fullWidth
              value={nameFilter}
              onChange={(e) => handleNameFilterChange(e.target.value)}
            />
            <GithubLanguageFilter
              onChange={handleLanguageFilterChange}
              selectedLanguages={languageFilter}
            />
          </>
        )}
        {repoLoading || filteredLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{`Error: ${error.message}`}</Typography>
        ) : (
              <RepositoryTable
                repositories={repositories}
                loading={repoLoading || filteredLoading}
                totalCount={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
        )}
      </Stack>
    </Container>
  );
};

export default RepositorySearch;
