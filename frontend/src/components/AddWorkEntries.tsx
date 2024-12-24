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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Employee, WorkEntry, PayrollRun } from '../types/types';
import { fetchActiveEmployees, submitWorkEntries, closePayrollRun } from '../services/api';

interface Props {
  currentPayrollRun: PayrollRun | null;
  onPayrollRunUpdated: () => void;
}

const AddWorkEntries: React.FC<Props> = ({ currentPayrollRun, onPayrollRunUpdated }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workEntries, setWorkEntries] = useState<Record<number, WorkEntry>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

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
            payroll_run: currentPayrollRun?.id,
            payroll_period_start: currentPayrollRun?.payroll_period_start || '',
            payroll_period_end: currentPayrollRun?.payroll_period_end || '',
            hours_worked: emp.worker_type === 'hourly' ? 0 : undefined,
            days_worked: emp.worker_type === 'daily' ? 0 : undefined,
            is_paid: false,
            payment_type: '', 
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

    if (currentPayrollRun) {
      getEmployees();
    }
  }, [currentPayrollRun]);

  const handleInputChange = (
    employeeId: number,
    field: 'hours_worked' | 'days_worked' | 'payment_type' | 'deferred_payment_date',
    value: string
  ) => {
    setWorkEntries((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: field === 'deferred_payment_date' ? value : value === '' ? undefined : Number(value),
      },
    }));
  };

  const calculatePayroll = (employeeId: number) => {
    const entry = workEntries[employeeId];
    let gross_pay = 0;
    let total_deductions = 0;
    let net_pay = 0;

    if (entry.employee.worker_type === 'hourly' && entry.hours_worked) {
      const rate = entry.employee.hourly_rate || 0;
      gross_pay = entry.hours_worked * rate;
    } else if (entry.employee.worker_type === 'daily' && entry.days_worked) {
      const rate = entry.employee.daily_rate || 0;
      gross_pay = entry.days_worked * rate;
    }

    // Example deductions
    const federal_tax = gross_pay * 0.10;     // 10% Federal Tax
    const state_tax = gross_pay * 0.05;       // 5% State Tax
    const social_security = gross_pay * 0.062; // 6.2% SS
    const medicare = gross_pay * 0.0145;        // 1.45% Medicare
    const health_insurance = 100;             // Fixed amount
    const retirement_contribution = 50;       // Fixed amount

    total_deductions = federal_tax + state_tax + social_security + medicare + health_insurance + retirement_contribution;
    net_pay = gross_pay - total_deductions;

    setWorkEntries((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        gross_pay,
        total_deductions,
        net_pay,
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Prepare entries to submit
      const entriesToSubmit: WorkEntry[] = [];
      Object.values(workEntries).forEach((entry) => {
        if (
          (entry.employee.worker_type === 'hourly' && (entry.hours_worked || 0) > 0) ||
          (entry.employee.worker_type === 'daily' && (entry.days_worked || 0) > 0)
        ) {
          entriesToSubmit.push(entry);
        }
      });

      if (entriesToSubmit.length === 0) {
        setError('Please enter valid work entries for at least one employee.');
        setSubmitting(false);
        return;
      }

      // Submit entries
      await submitWorkEntries(entriesToSubmit);
      setSuccess('Work entries submitted successfully.');

      // Optionally, close payroll run
      await closePayrollRun(currentPayrollRun!.id);
      setSuccess('Payroll run closed successfully.');
      onPayrollRunUpdated(); // Refresh payroll runs or related data
    } catch (err: any) {
      setError('Failed to submit work entries or close payroll run.');
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
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Add Work Entries for Payroll Run #{currentPayrollRun?.id}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Payroll Period: {currentPayrollRun?.payroll_period_start} to {currentPayrollRun?.payroll_period_end}
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
              {/* Payment Type Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel id={`payment-type-label-${employee.id}`}>Payment Type</InputLabel>
                <Select
                  labelId={`payment-type-label-${employee.id}`}
                  id={`payment-type-select-${employee.id}`}
                  value={workEntries[employee.id]?.payment_type || ''}
                  label="Payment Type"
                  onChange={(e) =>
                    handleInputChange(employee.id, 'payment_type', e.target.value as string)
                  }
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="deferred">Deferred</MenuItem>
                </Select>
              </FormControl>

              {/* Calculate Button */}
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => calculatePayroll(employee.id)}
                >
                  Calculate
                </Button>
              </Box>

              {/* Display Calculated Fields */}
              {workEntries[employee.id]?.gross_pay !== undefined && (
                <Box mt={2}>
                  <Typography variant="body2">
                    <strong>Gross Pay:</strong> $
                    {workEntries[employee.id]?.gross_pay?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Deductions:</strong> $
                    {workEntries[employee.id]?.total_deductions?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Net Pay:</strong> $
                    {workEntries[employee.id]?.net_pay?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Type</strong> $
                    {workEntries[employee.id].payment_type}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Close Payroll'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddWorkEntries;
