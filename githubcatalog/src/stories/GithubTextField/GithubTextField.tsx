import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export type GithubTextFieldProps = TextFieldProps & {
  // Add any custom props here if needed
};

const GithubTextField: React.FC<GithubTextFieldProps> = (props) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      margin="normal"
      {...props} // Spread any props so the component remains flexible
    />
  );
};

export default GithubTextField;
