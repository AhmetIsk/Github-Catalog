import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography } from '@mui/material';

interface RepositoryTableProps {
  repositories: any[];
  loading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({
  repositories,
  loading,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => (
  <>
    {repositories.length === 0 && !loading && (
      <Typography variant="h6" color="textSecondary">
        No repositories found
      </Typography>
    )}

    <TableContainer component={Paper}>
      <Table aria-label="repositories table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Primary Language</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            repositories.map((repo, index) => (
              <TableRow key={index}>
                <TableCell>{repo.node.name}</TableCell>
                <TableCell>{repo.node.description || 'No description available'}</TableCell>
                <TableCell>{repo.node.primaryLanguage?.name || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </>
);

export default RepositoryTable;
