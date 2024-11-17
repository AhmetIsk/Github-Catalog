import { Stack, Typography, Autocomplete, TextField } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as GithubIcon } from "../../assets/Github.svg";

export type GithubSearchProps = {
  handleUsernameSelect: (username: string) => void;
  handleInputChange: (event: React.ChangeEvent<{}>, value: string) => void;
  users: any[];
  usersLoading: boolean;
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

const GithubSearch: React.FC<GithubSearchProps> = ({ handleUsernameSelect, handleInputChange, users, usersLoading, selectedUsername }) => {
  const iconSize = selectedUsername ? 30 : 98;
  return (
    <Stack sx={selectedUsername ? SearchWrapperStyle : SearchWrapperInitialStyle} spacing={selectedUsername ?? 4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <GithubIcon width={iconSize} height={iconSize} />
        <Typography variant={!selectedUsername ? "h2" : "h6"} fontFamily="monospace" fontWeight="bold">
          <FormattedMessage id="main.title" />
        </Typography>
      </Stack>
      <Autocomplete
        fullWidth
        freeSolo
        options={users}
        getOptionLabel={(option: any) => option.login}
        onInputChange={handleInputChange}
        onChange={(event, newValue) => handleUsernameSelect(newValue?.login || '')}
        loading={usersLoading}
        renderInput={(params) => <TextField {...params} label="Search for Username" />}
        disableClearable
      />
    </Stack>
  )
};

export default GithubSearch;