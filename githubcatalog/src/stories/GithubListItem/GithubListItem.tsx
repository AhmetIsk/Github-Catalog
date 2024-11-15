import React from "react";
import { ListItem, ListItemText, Typography } from "@mui/material";

export type GithubListItemProps = {
  title: string;
  description?: string;
  language?: string;
}

const GithubListItem: React.FC<GithubListItemProps> = ({ title, description, language }) => {
  return (
    <ListItem sx={{ mb: 2, p: 2, border: "1px solid #ddd" }}>
      <ListItemText
        primary={<Typography variant="h6">{title}</Typography>}
        secondary={
          <>
            {description && <Typography variant="body2">{description}</Typography>}
            {language && <Typography variant="body2" color="textSecondary">Language: {language}</Typography>}
          </>
        }
      />
    </ListItem>
  );
};

export default GithubListItem;
