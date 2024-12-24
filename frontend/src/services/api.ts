import axios from 'axios';
import { Employee, PayrollRun, WorkEntry } from '../types/types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees/');
  return response.data;
};

// Fetch all active employees
export const fetchActiveEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>('/employees/', {
    params: { is_active: true },
  });
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

// Submit multiple work entries
export const submitWorkEntries = async (workEntries: WorkEntry[]): Promise<WorkEntry[]> => {
  const response = await api.post<WorkEntry[]>('/work-entries/bulk-create/', { work_entries: workEntries });
  return response.data;
};

// Fetch all payroll runs
export const fetchPayrollRuns = async (): Promise<PayrollRun[]> => {
  const response = await api.get<PayrollRun[]>('/payroll-runs/');
  return response.data;
};

// Create a new payroll run
export const createPayrollRun = async (payrollRunData: Partial<PayrollRun>): Promise<PayrollRun> => {
  const response = await api.post<PayrollRun>('/payroll-runs/', payrollRunData);
  return response.data;
};

// Close a payroll run
export const closePayrollRun = async (payrollRunId: number): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/payroll-runs/${payrollRunId}/close/`);
  return response.data;
};

export const fetchPayrollRunDetails = async (id: number): Promise<PayrollRun> => {
  const response = await api.get<PayrollRun>(`/payroll-runs/${id}/`);
  return response.data;
};