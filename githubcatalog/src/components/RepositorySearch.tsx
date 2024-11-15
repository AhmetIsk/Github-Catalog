import React, { useState, useEffect } from 'react';
import { Typography, Container, CircularProgress, TextField, Autocomplete, Box, Stack, MenuItem } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_REPOSITORIES_FILTERED, GET_USER_REPOSITORIES, GET_USERNAMES } from '../graphql/queries';
import RepositoryTable from './RepositoryTable';
import GithubButton from '../stories/GithubButton/GithubButton';

const buildSearchQuery = (username: string, name?: string, language?: string) => {
  let query = `user:${username}`;
  if (name) query += ` ${name}`;
  if (language) query += ` language:${language}`;
  return query;
};

const RepositorySearch = () => {
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [nameFilter, setNameFilter] = useState<string>('');
  const [languages, setLanguages] = useState<string[]>([]);

  const [fetchRepositories, { data, loading: repoLoading, error }] = useLazyQuery(GET_USER_REPOSITORIES, {
    onCompleted: (data) => {
      const edges = data?.user?.repositories?.edges || [];
      setRepositories(edges);
      setEndCursor(data?.user?.repositories?.pageInfo?.endCursor || null);
      setLoading(false);

      // Populate unique programming languages
      const langs = edges
        .map((edge: any) => edge.node.primaryLanguage?.name)
        .filter((lang: string | null) => lang);
      setLanguages(Array.from(new Set(langs)));
    },
  });

  const [fetchFilteredRepositories, { data: filteredData, loading: filteredLoading }] = useLazyQuery(GET_REPOSITORIES_FILTERED, {
    onCompleted: (data) => {
      setRepositories(data.search.edges);
      setEndCursor(data.search.pageInfo.endCursor);
      setLoading(false);
    },
  });

  const [fetchUsers, { data: usersData, loading: usersLoading }] = useLazyQuery(GET_USERNAMES, {
    onCompleted: (data) => setUsers(data.search.nodes),
  });

  const handleUsernameSelect = (username: string) => {
    setSelectedUsername(username);
    setPage(0);
    setRepositories([]);
    setLoading(true);
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

  const handleFilterChange = () => {
    if (!selectedUsername) return;
    setLoading(true);

    const query = buildSearchQuery(
      selectedUsername,
      nameFilter || undefined,
      languageFilter || undefined
    );

    fetchFilteredRepositories({
      variables: {
        query,
        first: 10,
        after: null,
      },
    });
  };


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
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <TextField
              select
              label="Filter by Programming Language"
              variant="outlined"
              fullWidth
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <MenuItem value="">All Languages</MenuItem>
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            <GithubButton onClick={handleFilterChange}>Apply Filters</GithubButton>
          </>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{`Error: ${error.message}`}</Typography>
        ) : (
              <RepositoryTable
                repositories={repositories}
                loading={repoLoading}
                totalCount={data?.user?.repositories?.totalCount || 0}
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
