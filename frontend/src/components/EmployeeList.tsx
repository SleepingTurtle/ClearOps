import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { fetchEmployees, deleteEmployee } from '../services/api';
import { Employee } from '../types/types';
import AddEmployeeForm from './AddEmployeeForm';
import EditEmployeeForm from './EditEmployeeForm';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    useEffect(() => {
        const getEmployees = async () => {
            try {
                const data = await fetchEmployees();
                setEmployees(data)
            } catch (err) {
                setError('Failed to fetch employees');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getEmployees();
    }, []);

    const handleAdd = (employee: Employee) => {
        setEmployees((prev) => [...prev, employee]);
    };

    const handleUpdate = (updatedEmployee: Employee) => {
        setEmployees((prev) =>
        prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
    };

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (employeeToDelete) {
        try {
            await deleteEmployee(employeeToDelete.id);
            setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id));
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        } catch (err) {
            console.error('Failed to delete employee:', err);
            // Optionally, set error state to display in UI
        }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    if (loading) {
        return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <CircularProgress />
            <Typography variant="h6" style={{ marginTop: '1rem' }}>
                Loading employees...
            </Typography>
        </div>
        )
    }

    if (error) {
        return ( 
            <Typography variant="h6" color="error" style={{ textAlign: 'center', marginTop: '2rem' }}>
                {error}
            </Typography>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" style={{ marginTop: '2rem' }}>
                Employee List
                </Typography>
                <AddEmployeeForm onAdd={handleAdd} />
            </div>
        <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Worker Type</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date Joined</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {employees.length === 0 ? (
                <TableRow>
                <TableCell colSpan={6} align="center">
                    No employees found.
                </TableCell>
                </TableRow>
            ) : (
                employees.map((emp) => (
                <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{`${emp.first_name} ${emp.last_name}`}</TableCell>
                    <TableCell>{emp.worker_type.charAt(0).toUpperCase() + emp.worker_type.slice(1)}</TableCell>
                    <TableCell>
                    {emp.worker_type === 'hourly'
                        ? `$${emp.hourly_rate}/hr`
                        : `$${emp.daily_rate}/day`}
                    </TableCell>
                    <TableCell>{emp.is_active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>{new Date(emp.hire_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <EditEmployeeForm employee={emp} onUpdate={handleUpdate} />
                        <Tooltip title="Delete">
                            <IconButton
                                color="secondary"
                                onClick={() => handleDeleteClick(emp)}
                                aria-label="delete"
                            >
                            <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
        </Table>
        </TableContainer>
    
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
            <Typography>
                Are you sure you want to delete{' '}
                <strong>{employeeToDelete && `${employeeToDelete.first_name} ${employeeToDelete.last_name}`}</strong>?
            </Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="secondary" variant="contained">
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default EmployeeList;