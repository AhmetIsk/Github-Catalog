import React from "react";
import RepositorySearch from "./RepositorySearch";
import { Stack, Box, Typography, Button } from "@mui/material";
interface MainComponentProps {
  onLocaleChange: (newLocale: "en" | "de") => void;
  currentLocale: "en" | "de";
}

const MainComponent: React.FC<MainComponentProps> = ({ onLocaleChange, currentLocale }) => {
  return (
    <Box position="relative" height="100vh">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        p={1}
      >
        <Button
          onClick={() => onLocaleChange("en")}
          color={currentLocale === "en" ? "primary" : "inherit"}
          size="small"
        >
          EN
        </Button>
        <Typography variant="body2" color="textSecondary">
          |
        </Typography>
        <Button
          onClick={() => onLocaleChange("de")}
          color={currentLocale === "de" ? "primary" : "inherit"}
          size="small"
        >
          DE
        </Button>
      </Box>

      {/* Page Content */}
      <Stack spacing={2} flex={1}>
        <RepositorySearch />
      </Stack>
    </Box>
  );
};

export default MainComponent;
