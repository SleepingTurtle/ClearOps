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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
          <Typography variant="h6" color="error" align="center" mt={4}>
            {error}
          </Typography>
        ) : payrollRun ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Payroll Period: {new Date(payrollRun.payroll_period_start).toLocaleDateString()} -{' '}
              {new Date(payrollRun.payroll_period_end).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Date Processed: {new Date(payrollRun.date_processed).toLocaleString()}
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
                    <TableCell><strong>Employee</strong></TableCell>
                    <TableCell><strong>Worker Type</strong></TableCell>
                    <TableCell><strong>Hours Worked</strong></TableCell>
                    <TableCell><strong>Days Worked</strong></TableCell>
                    <TableCell><strong>Payment Type</strong></TableCell>
                    <TableCell><strong>Payment Date</strong></TableCell>
                    <TableCell><strong>Notes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrollRun.work_entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No work entries found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payrollRun.work_entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{`${entry.employee.first_name} ${entry.employee.last_name}`}</TableCell>
                        <TableCell>
                          {entry.employee.worker_type.charAt(0).toUpperCase() +
                            entry.employee.worker_type.slice(1)}
                        </TableCell>
                        <TableCell>{entry.hours_worked ?? '-'}</TableCell>
                        <TableCell>{entry.days_worked ?? '-'}</TableCell>
                        <TableCell>{entry.payment_type || '-'}</TableCell>
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

            {/* Optional: Detailed View for Each Work Entry */}
            {payrollRun.work_entries.map((entry) => (
              <Accordion key={entry.id} style={{ marginTop: '1rem' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${entry.id}-content`}
                  id={`panel-${entry.id}-header`}
                >
                  <Typography>
                    {`${entry.employee.first_name} ${entry.employee.last_name}`} -{' '}
                    {entry.employee.worker_type.charAt(0).toUpperCase() + entry.employee.worker_type.slice(1)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1">
                    Payroll Period: {new Date(entry.payroll_period_start).toLocaleDateString()} -{' '}
                    {new Date(entry.payroll_period_end).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    {entry.employee.worker_type === 'hourly' ? `Hours Worked: ${entry.hours_worked}` : `Days Worked: ${entry.days_worked}`}
                  </Typography>
                  <Typography variant="subtitle1">
                    Payment Type: {entry.payment_type || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    Payment Date: {entry.payment_date ? new Date(entry.payment_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    Notes: {entry.notes || 'N/A'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
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
