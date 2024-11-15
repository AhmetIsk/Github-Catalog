import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_REPOSITORIES } from "../graphql/queries";
import GithubTextField from "../stories/GithubTextField/GithubTextField";
import GithubButton from "../stories/GithubButton/GithubButton";
import { CircularProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from "@mui/material";

interface RepositorySearchProps { }

const RepositorySearch: React.FC<RepositorySearchProps> = () => {
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_USER_REPOSITORIES, {
    variables: { username, first: rowsPerPage, after: cursor },
    skip: !username,
  });

  const handleSearch = () => {
    setPage(0);
    setCursor(null);
    refetch({ username, first: rowsPerPage, after: null });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const newCursor = data?.user.repositories.pageInfo.endCursor;
    if (newCursor) {
      setCursor(newCursor);
      refetch({ username, first: rowsPerPage, after: newCursor });
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when rows per page is changed
    setCursor(null);
    refetch({ username, first: newRowsPerPage, after: null });
  };

  // Directly using the data from the GraphQL query
  const repositories = data?.user.repositories.edges || [];

  // Apply filtering
  const filteredRepositories = repositories.filter((repo: any) =>
    repo.node.name.toLowerCase().includes(filter.toLowerCase()) &&
    (languageFilter ? repo.node.primaryLanguage?.name === languageFilter : true)
  );

  return (
    <Box sx={{ padding: 3 }}>
      <GithubTextField
        label="GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <GithubButton onClick={handleSearch}>Search Repositories</GithubButton>

      <GithubTextField
        label="Filter by Repository Name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
      />
      <GithubTextField
        label="Filter by Language"
        value={languageFilter}
        onChange={(e) => setLanguageFilter(e.target.value)}
        fullWidth
      />

      {loading && <CircularProgress />}

      {error && <Box sx={{ color: "red" }}>Error fetching repositories</Box>}

      {filteredRepositories.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="repositories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Language</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRepositories.map((repo: any) => (
                <TableRow key={repo.node.name}>
                  <TableCell>{repo.node.name}</TableCell>
                  <TableCell>{repo.node.description}</TableCell>
                  <TableCell>{repo.node.primaryLanguage?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>No repositories found.</Box>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.user.repositories.totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default RepositorySearch;
