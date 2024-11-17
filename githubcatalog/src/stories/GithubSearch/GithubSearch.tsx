import { Stack, Typography, Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ReactComponent as GithubIcon } from "../../assets/Github.svg";
import { useLazyQuery } from "@apollo/client";
import { GET_USERNAMES } from "../../graphql/queries";
import useDebounce from "../../hooks/useDebounce";

export type GithubSearchProps = {
  handleUsernameSelect: (username: string) => void;
  selectedUsername: string | null;
};

const SearchWrapperInitialStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: 3,
};

const SearchWrapperStyle = {
  ...SearchWrapperInitialStyle,
  flexDirection: 'row',
  gap: 2,
};

const GithubSearch: React.FC<GithubSearchProps> = ({ handleUsernameSelect, selectedUsername }) => {
  const intl = useIntl();
  const iconSize = selectedUsername ? 30 : 98;
  const [users, setUsers] = useState<any[]>([]);
  const [userError, setUserError] = useState<string | null>(null);


  const [fetchUsers, { loading: usersLoading }] = useLazyQuery(GET_USERNAMES, {
    onCompleted: (data) => {
      setUsers(data.search.nodes);
      setUserError(null);
    },
    onError: (error) => {
      setUserError(error.message);
    },
  });

  const handleInputChange = (_event: any, value: string) => {
    if (value.length > 2) {
      fetchUsers({ variables: { query: value } });
    } else {
      setUsers([]);
    }
  };

  const debouncedHandleInputChange = useDebounce(handleInputChange, 500);

  return (
    <Stack sx={selectedUsername ? SearchWrapperStyle : SearchWrapperInitialStyle} spacing={selectedUsername ?? 4}>
      <Stack direction="row" alignItems="center" spacing={2} onClick={() => window.location.href = '/'} sx={{ cursor: 'pointer' }}>
        <GithubIcon width={iconSize} height={iconSize} />
        <Typography variant={!selectedUsername ? "h2" : "h6"} fontFamily="monospace" fontWeight="bold">
          <FormattedMessage id="main.title" />
        </Typography>
      </Stack>
      <Autocomplete
        fullWidth
        options={users}
        getOptionLabel={(option: any) => option.login}
        onInputChange={debouncedHandleInputChange}
        onChange={(_event, newValue) =>
          handleUsernameSelect(newValue?.login || '')
        }
        loading={usersLoading}
        renderInput={(params) => <TextField {...params} label={intl.formatMessage({ id: 'githubcatalog.searchForUsername', defaultMessage: 'Search for Username' })} />}
        disableClearable
      />
      {userError && (
        <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {userError}
        </Typography>
      )}
    </Stack>
  )
};

export default GithubSearch;