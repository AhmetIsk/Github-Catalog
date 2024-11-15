import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_USERNAMES } from '../graphql/queries';

const UsernameSearch = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  // Lazy query for getting usernames based on input
  const [fetchUsers, { data, loading, error }] = useLazyQuery(GET_USERNAMES, {
    variables: { query: username },
    onCompleted: () => {
      if (data) {
        setUsers(data.search.nodes);
      }
    },
  });

  const handleInputChange = (event: any, value: string) => {
    setUsername(value);
    if (value.length > 2) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        options={users}
        getOptionLabel={(option: any) => option.login}
        onInputChange={handleInputChange}
        onChange={(event, newValue) => setUsername(newValue?.login || '')}
        renderInput={(params) => <TextField {...params} label="Search for Username" />}
        loading={loading}
        disableClearable
        renderOption={(props, option) => (
          <li {...props}>
            {option.login}
          </li>
        )}
      />
      {error && <div>Error loading users: {error.message}</div>}
    </div>
  );
};

export default UsernameSearch;
