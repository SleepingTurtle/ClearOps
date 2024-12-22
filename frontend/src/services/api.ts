import axios from 'axios';
import { Employee, PayrollRun } from '../types/types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees/');
  return response.data;
};

// Add a new employee
export const addEmployee = async (employee: Partial<Employee>): Promise<Employee> => {
  const response = await api.post<Employee>('/employees/', employee);
  return response.data;
};

// Update an existing employee
export const updateEmployee = async (id: number, employee: Partial<Employee>): Promise<Employee> => {
  const response = await api.put<Employee>(`/employees/${id}/`, employee);
  return response.data;
};

// Delete an employee
export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}/`);
};

export const fetchPayrollRuns = async (): Promise<PayrollRun[]> => {
  const response = await api.get<PayrollRun[]>('/payroll-runs/');
  return response.data;
};

export const fetchPayrollRunDetails = async (id: number): Promise<PayrollRun> => {
  const response = await api.get<PayrollRun>(`/payroll-runs/${id}/`);
  return response.data;
};