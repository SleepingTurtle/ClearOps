// src/components/Footer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
// Optionally, import the version from package.json
import packageJson from '../../package.json';

const Footer: React.FC = () => {
  const version = packageJson.version || 'v1.0.0'; // Fallback if version isn't found

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        ClearOps Payroll System {version}
      </Typography>
    </Box>
  );
};

export default Footer;
