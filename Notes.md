# API Request for app

## Employee

```json
{
    "first_name":"Alex",
    "last_name":"Jaelson",
    "worker_type":"hourly",
    "is_active":true,
    "hourly_rate":"22"
}
```

## Payment Record

```json
{
  "employee": 1,
  "payroll_period_start": "2024-12-01",
  "payroll_period_end": "2024-12-07",
  "hours_worked": "40",
  "days_worked": null,
  "notes": "Standard workweek."

{
  "employee": 3,
  "payroll_period_start": "2024-12-01",
  "payroll_period_end": "2024-12-07",
  "hours_worked": null,
  "days_worked": "5",
  "notes": "5 working days."
}
}
```

## Payroll Run - POST

```json
{
  "payroll_period_start": "2024-12-01",
  "payroll_period_end": "2024-12-07"
}
```

## Docker DB

```sh
docker exec -it my_postgres psql -U your_db_username -d your_db_name
```

## Resetting migrations

```sh
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
```
