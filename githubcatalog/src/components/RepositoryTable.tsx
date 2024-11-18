import React from 'react';
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { ReactComponent as GithubIcon } from '../assets/Github.svg';

interface RepositoryTableProps {
  repositories: any[];
  loading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (rowsPerPage: number) => void;
  columns: GridColDef[];
  rows: any[];
  tableHeader?: string;
}

const RepositoryTable: React.FC<RepositoryTableProps> = ({
  repositories,
  loading,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  columns,
  rows,
  tableHeader,
}) => {
  const intl = useIntl();

  return (
    <Box sx={{ height: '70vh', p: 2 }}>
      {repositories.length === 0 && !loading ? (
        <Stack alignItems="center" justifyContent="center" height="100%" spacing={2}>
          <GithubIcon width={98} height={98} />
          <Typography
            variant="h6"
            color="textSecondary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            {intl.formatMessage({
              id: 'githubcatalog.noRepositories',
              defaultMessage: 'No repositories found with the given filters',
            })}
          </Typography>
        </Stack>
      ) : (
          <>
            {!loading && <Typography variant="h4" color="text.primary" textAlign="center" sx={{ mb: 2 }} fontFamily="monospace">
              {tableHeader}
            </Typography>}
          <DataGrid
            className="repository-table"
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{ pageSize: rowsPerPage, page }}
            rowCount={totalCount}
            paginationMode="server"
            pagination
            loading={loading}
            onPaginationModelChange={({ page, pageSize }) => {
              if (pageSize !== rowsPerPage) {
                handleChangeRowsPerPage(pageSize);
              } else {
                handleChangePage(page);
              }
            }}
            disableColumnMenu
            disableRowSelectionOnClick={true}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiDataGrid-cell': {
                alignItems: 'center',
              },
            }}
          />
          </>
      )}
    </Box>
  );
};

export default RepositoryTable;
