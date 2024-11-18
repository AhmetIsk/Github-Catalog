import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Stack, ListItem } from '@mui/material';
import { useIntl } from 'react-intl';
import { LANGUAGES } from '../../utils/constants';

interface GithubLanguageFilterProps {
  onChange: (languages: string[]) => void;
  disabled?: boolean;
}

const GithubLanguageFilter: React.FC<GithubLanguageFilterProps> = ({
  onChange,
  disabled = false,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const handleLanguagesChange = (event: any, newValue: string[]) => {
    setSelectedLanguages(newValue);
    onChange(newValue);
  };
  const intl = useIntl();

  useEffect(() => {
    if (disabled) {
      setSelectedLanguages([]);
    }
  }, [disabled]);

  return (
    <Stack width="100%">
      <Autocomplete
        multiple
        options={LANGUAGES}
        value={selectedLanguages}
        onChange={handleLanguagesChange}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} name="searchByProgrammingLanguage" label={intl.formatMessage({ id: 'githubcatalog.languageFilter', defaultMessage: 'Select Languages' })} />}
        renderOption={(props, option) => (
          <ListItem {...props} key={option}>
            {option}
          </ListItem>
        )}
      />

      {selectedLanguages.length > 0 && !disabled && (
        <Stack sx={{ marginBlock: 1 }} fontSize="0.8rem">
          {intl.formatMessage({ id: 'githubcatalog.selectedLanguages', defaultMessage: 'Selected Languages: ' })}
          {selectedLanguages.join(', ')}
        </Stack>
      )}
    </Stack>
  );
};

export default GithubLanguageFilter;
