import React from 'react';
import { Typography, Box } from '@mui/material';

const NotFound: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you're looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFound;