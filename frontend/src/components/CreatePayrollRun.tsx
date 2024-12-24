import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createPayrollRun } from '../services/api';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const CreatePayrollRun: React.FC = () => {
  const [payrollPeriodStart, setPayrollPeriodStart] = useState<string>('');
  const [payrollPeriodEnd, setPayrollPeriodEnd] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Initialize default payroll period to current week (Sunday to Saturday)
  React.useEffect(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
    const end = endOfWeek(today, { weekStartsOn: 0 });     // Saturday
    setPayrollPeriodStart(format(start, 'yyyy-MM-dd'));
    setPayrollPeriodEnd(format(end, 'yyyy-MM-dd'));
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const newPayrollRun = await createPayrollRun({
        payroll_period_start: payrollPeriodStart,
        payroll_period_end: payrollPeriodEnd,
        notes,
      });
      setSuccess(`Payroll Run #${newPayrollRun.id} created successfully.`);
      // Optionally, reset form or navigate to payroll run details
    } catch (err: any) {
      setError('Failed to create payroll run.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Create New Payroll Run
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box component="form" noValidate autoComplete="off">
        <Paper elevation={3} sx={{ p: 2 }}>
            <TextField
            label="Payroll Period Start"
            type="date"
            value={payrollPeriodStart}
            onChange={(e) => setPayrollPeriodStart(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            fullWidth
            margin="normal"
            />
            <TextField
            label="Payroll Period End"
            type="date"
            value={payrollPeriodEnd}
            onChange={(e) => setPayrollPeriodEnd(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            fullWidth
            margin="normal"
            />
            <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            margin="normal"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
            >
                {loading ? 'Creating...' : 'Create Payroll Run'}
            </Button>
            </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreatePayrollRun;
