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
import { updateEmployee } from '../services/api';
import { Employee } from '../types/types';

interface EditEmployeeFormProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, onUpdate }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Employee>>({ ...employee });

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
      const updated = await updateEmployee(employee.id, formData);
      onUpdate(updated);
      handleClose();
    } catch (error) {
      console.error('Failed to update employee:', error);
      // Optionally, set error state to display in UI
    }
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Employee</DialogTitle>
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditEmployeeForm;
