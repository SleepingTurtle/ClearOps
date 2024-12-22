import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { addEmployee } from '../services/api';
import { Employee } from '../types/types';

interface AddEmployeeFormProps {
  onAdd: (employee: Employee) => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onAdd }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    first_name: '',
    last_name: '',
    worker_type: 'hourly',
    is_active: true,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name!]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newEmployee = await addEmployee(formData);
      onAdd(newEmployee);
      handleClose();
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        worker_type: 'hourly',
        is_active: true,
      });
    } catch (error) {
      console.error('Failed to add employee:', error);
      // Optionally, set error state to display in UI
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Employee
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            name="first_name"
            fullWidth
            variant="outlined"
            value={formData.first_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            fullWidth
            variant="outlined"
            value={formData.last_name}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            label="Worker Type"
            name="worker_type"
            fullWidth
            variant="outlined"
            value={formData.worker_type}
            onChange={handleChange}
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </TextField>
          {formData.worker_type === 'hourly' ? (
            <TextField
              margin="dense"
              label="Hourly Rate"
              name="hourly_rate"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.hourly_rate || ''}
              onChange={handleChange}
            />
          ) : (
            <TextField
              margin="dense"
              label="Daily Rate"
              name="daily_rate"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.daily_rate || ''}
              onChange={handleChange}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={handleChange}
                name="is_active"
                color="primary"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEmployeeForm;
