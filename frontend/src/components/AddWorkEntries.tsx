// src/components/AddWorkEntries.tsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { Employee, WorkEntry } from '../types/types';
import { fetchActiveEmployees, submitWorkEntries } from '../services/api';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const AddWorkEntries: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workEntries, setWorkEntries] = useState<Record<number, WorkEntry>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Calculate current payroll week (Sunday to Saturday)
  const today = new Date();
  const payrollPeriodStart = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');
  const payrollPeriodEnd = format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchActiveEmployees();
        setEmployees(data);
        // Initialize workEntries state
        const initialEntries: Record<number, WorkEntry> = {};
        data.forEach((emp) => {
          initialEntries[emp.id] = {
            employee: emp,
            payroll_period_start: payrollPeriodStart,
            payroll_period_end: payrollPeriodEnd,
            hours_worked: emp.worker_type === 'hourly' ? 0 : undefined,
            days_worked: emp.worker_type === 'daily' ? 0 : undefined,
            payment_type: 'cash',
            is_paid: false,
          };
        });
        setWorkEntries(initialEntries);
      } catch (err) {
        setError('Failed to fetch active employees.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, [payrollPeriodStart, payrollPeriodEnd]);

  const handleInputChange = (
    employeeId: number,
    field: 'hours_worked' | 'days_worked',
    value: string
  ) => {
    setWorkEntries((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value === '' ? undefined : Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Validate entries
      const entriesToSubmit: WorkEntry[] = [];
      Object.values(workEntries).forEach((entry) => {
        if (
          (entry.employee.worker_type === 'hourly' && (!entry.hours_worked || entry.hours_worked <= 0)) ||
          (entry.employee.worker_type === 'daily' && (!entry.days_worked || entry.days_worked <= 0))
        ) {
          // Skip invalid entries or handle as needed
          return;
        }
        entriesToSubmit.push(entry);
      });

      if (entriesToSubmit.length === 0) {
        setError('Please enter valid work entries for at least one employee.');
        setSubmitting(false);
        return;
      }

      // Submit entries
      await submitWorkEntries(entriesToSubmit);
      setSuccess('Work entries submitted successfully.');
      // Optionally, reset the form or update state as needed
    } catch (err: any) {
      setError('Failed to submit work entries.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading active employees...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Work Entries for Current Payroll Week
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Payroll Period: {payrollPeriodStart} to {payrollPeriodEnd}
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

      <Grid container spacing={2}>
        {employees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {employee.first_name} {employee.last_name}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {employee.worker_type.charAt(0).toUpperCase() + employee.worker_type.slice(1)} Worker
              </Typography>
              {employee.worker_type === 'hourly' ? (
                <TextField
                  label="Hours Worked"
                  type="number"
                  value={workEntries[employee.id]?.hours_worked ?? ''}
                  onChange={(e) =>
                    handleInputChange(employee.id, 'hours_worked', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              ) : (
                <TextField
                  label="Days Worked"
                  type="number"
                  value={workEntries[employee.id]?.days_worked ?? ''}
                  onChange={(e) =>
                    handleInputChange(employee.id, 'days_worked', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 0, step: 0.1 }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Work Entries'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddWorkEntries;
