import React from 'react';
import { Autocomplete, TextField, Chip, Box, Typography, Stack, ListItem } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface GithubLanguageFilterProps {
  onChange: (languages: string[]) => void;
  selectedLanguages: string[];
}

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'PHP', 'HTML', 'CSS', 'Shell', 'Objective-C', 'Scala', 'Rust', 'Dart', 'Perl', 'Haskell',
  'Lua', 'R', 'Elixir', 'Clojure', 'Erlang', 'Groovy', 'VimL', 'CoffeeScript', 'F#', 'PowerShell',
  'Visual Basic', 'Matlab', 'Assembly', 'Fortran', 'COBOL', 'Pascal', 'Ada', 'Prolog', 'Lisp',
  'Scheme', 'Julia', 'Crystal', 'Nim', 'OCaml', 'Racket', 'Smalltalk', 'Tcl', 'ActionScript',
  'ColdFusion', 'D', 'Forth', 'Hack', 'J', 'Kotlin', 'LiveScript', 'Nix', 'PureScript', 'QML',
  'Reason', 'Solidity', 'VHDL', 'Verilog', 'Zig'
];

const GithubLanguageFilter: React.FC<GithubLanguageFilterProps> = ({
  onChange,
  selectedLanguages,
}) => {

  const handleLanguagesChange = (event: any, newValue: string[]) => {
    onChange(newValue); // Notify parent component with selected languages
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={languages}
        value={selectedLanguages}
        onChange={handleLanguagesChange}
        renderInput={(params) => <TextField {...params} label="Select Languages" />}
        renderOption={(props, option) => (
          <ListItem {...props} key={option}>
            {option}
          </ListItem>
        )}
      />

      {selectedLanguages.length > 0 && (
        <Stack sx={{ marginBlock: 2 }}>
          <FormattedMessage id="githubcatalog.languageFilter" defaultMessage="Selected Languages: " />
          {selectedLanguages.join(', ')}
        </Stack>
      )}
    </div>
  );
};

export default GithubLanguageFilter;
