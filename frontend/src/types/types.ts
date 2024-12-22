export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    worker_type: 'hourly' | 'daily';
    hourly_rate?: number;
    daily_rate?: number;
    is_active: boolean;
    hire_date: string;
}

export interface PayrollRun {
  id: number;
  payroll_period_start: string; // ISO Date string
  payroll_period_end: string;   // ISO Date string
  date_processed: string;       // ISO Date string
  notes?: string;
  work_entries: WorkEntry[];
}

export interface WorkEntry {
  id: number;
  employee: Employee;
  payroll_run: PayrollRun;
  payroll_period_start: string;
  payroll_period_end: string;
  hours_worked?: number;
  days_worked?: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  health_insurance: number;
  retirement_contribution: number;
  total_deductions: number;
  net_pay: number;
  is_paid: boolean;
  payment_type: string;
  payment_date: string; // ISO Date string
  notes?: string;
}