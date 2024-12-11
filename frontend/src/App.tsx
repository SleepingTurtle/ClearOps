import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material'

import api from './services/api'

function App() {
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    api.get('/test-api/')
      .then(response => {
        setMessage(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
      })
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>ClearOps</h1>
      <Button variant='contained'>Test Button</Button>
      <Typography variant='body1' style={{ marginTop: '20px' }}>
        {message}
      </Typography>
    </div>
  )
}

export default App
