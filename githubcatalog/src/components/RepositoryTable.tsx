import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography, Chip } from '@mui/material';
import { LANGUAGE_COLORS } from '../utils/constants';
import { useIntl } from 'react-intl';
interface RepositoryTableProps {
  repositories: any[];
  loading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  includeForks: boolean;
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({
  repositories,
  loading,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  includeForks,
}) => {
  const intl = useIntl();
  return (
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
              <TableCell>{intl.formatMessage({ id: 'githubcatalog.repositoryName', defaultMessage: 'Name' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'githubcatalog.repositoryDescription', defaultMessage: 'Description' })}</TableCell>
              <TableCell>{intl.formatMessage({ id: 'githubcatalog.repositoryPrimaryLanguage', defaultMessage: 'Primary Language' })}</TableCell>
              {includeForks && <TableCell>{intl.formatMessage({ id: 'githubcatalog.repositoryIsFork', defaultMessage: 'Is Fork' })}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={includeForks ? 4 : 3} align="center">
                  {intl.formatMessage({ id: 'githubcatalog.repositoryLoading', defaultMessage: 'Loading...' })}
              </TableCell>
            </TableRow>
          ) : (
            repositories.map((repo, index) => (
              <TableRow key={index}>
                <TableCell>{repo.node.name}</TableCell>
                <TableCell>{repo.node.description || 'No description available'}</TableCell>
                <TableCell>                  {repo.node.primaryLanguage ? (
                  <Chip
                    label={repo.node.primaryLanguage.name}
                    style={{
                      backgroundColor: LANGUAGE_COLORS[repo.node.primaryLanguage.name] || 'defaultColor',
                      color: 'white',
                    }}
                  />
                ) : (
                  'N/A'
                )}
                </TableCell>
                {includeForks && <TableCell>{repo.node.isFork ? 'Yes' : 'No'}</TableCell>}
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
};

export default RepositoryTable;
