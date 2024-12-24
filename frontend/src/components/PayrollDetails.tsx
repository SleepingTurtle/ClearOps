// src/components/PayrollDetails.tsx

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { PayrollRun } from '../types/types';
import { fetchPayrollRunDetails } from '../services/api';

interface PayrollDetailsProps {
  open: boolean;
  onClose: () => void;
  payrollRunId: number | null;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ open, onClose, payrollRunId }) => {
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getPayrollRunDetails = async () => {
      if (payrollRunId === null) return;
      setLoading(true);
      try {
        const data = await fetchPayrollRunDetails(payrollRunId);
        setPayrollRun(data);
      } catch (err) {
        setError('Failed to fetch payroll run details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (open && payrollRunId !== null) {
      getPayrollRunDetails();
    }
  }, [open, payrollRunId]);

  const handleClose = () => {
    setPayrollRun(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Payroll Run Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <CircularProgress />
            <Typography variant="h6" mt={2}>
              Loading details...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : payrollRun ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Payroll Period: {payrollRun.payroll_period_start} to {payrollRun.payroll_period_end}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Date Created: {new Date(payrollRun.date_created).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Date Processed: {payrollRun.date_processed ? new Date(payrollRun.date_processed).toLocaleString() : 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status: {payrollRun.is_closed ? 'Closed' : 'Open'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Notes: {payrollRun.notes || 'N/A'}
            </Typography>

            <Typography variant="h6" gutterBottom style={{ marginTop: '1.5rem' }}>
              Work Entries
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Employee</strong></TableCell>
                    <TableCell><strong>Worker Type</strong></TableCell>
                    <TableCell><strong>Hours Worked</strong></TableCell>
                    <TableCell><strong>Days Worked</strong></TableCell>
                    <TableCell><strong>Gross Pay</strong></TableCell>
                    <TableCell><strong>Total Deductions</strong></TableCell>
                    <TableCell><strong>Net Pay</strong></TableCell>
                    <TableCell><strong>Payment Type</strong></TableCell>
                    <TableCell><strong>Payment Date</strong></TableCell>
                    <TableCell><strong>Deferred Payment Date</strong></TableCell>
                    <TableCell><strong>Notes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrollRun.work_entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        No work entries found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payrollRun.work_entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.id}</TableCell>
                        <TableCell>{`${entry.employee.first_name} ${entry.employee.last_name}`}</TableCell>
                        <TableCell>
                          {entry.employee.worker_type.charAt(0).toUpperCase() +
                            entry.employee.worker_type.slice(1)}
                        </TableCell>
                        <TableCell>{entry.hours_worked ?? '-'}</TableCell>
                        <TableCell>{entry.days_worked ?? '-'}</TableCell>
                        <TableCell>${entry.gross_pay}</TableCell>
                        <TableCell>${entry.total_deductions}</TableCell>
                        <TableCell>${entry.net_pay}</TableCell>
                        <TableCell>
                          {entry.payment_type
                            ? entry.payment_type.charAt(0).toUpperCase() + entry.payment_type.slice(1)
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {entry.payment_date
                            ? new Date(entry.payment_date).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>{entry.notes || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <Typography variant="h6" align="center" mt={4}>
            Select a payroll run to view details.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayrollDetails;
