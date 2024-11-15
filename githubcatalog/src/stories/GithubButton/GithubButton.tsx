import React from "react";
import { Button, ButtonProps } from "@mui/material";

export type GithubButtonProps = ButtonProps & {
  // Add custom props here if needed
};

const GithubButton: React.FC<GithubButtonProps> = (props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default GithubButton;
