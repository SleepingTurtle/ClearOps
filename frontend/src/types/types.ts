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