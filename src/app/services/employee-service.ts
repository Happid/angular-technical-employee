import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { IEmployee, IListEmployee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  
  private readonly DATA_URL = 'mockup/employees.json';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<IEmployee> {
    const localData = localStorage.getItem('employee');

    if (localData) {
      return of({
        employee: JSON.parse(localData),
      });
    }
    return this.http.get<IEmployee>(this.DATA_URL).pipe(
      tap((res) => {
        localStorage.setItem(
          'employee',
          JSON.stringify(res.employee)
        );
      })
    );
  }

  addEmployee(newEmployee: IListEmployee): void {
    const localData = localStorage.getItem('employee');
    const employees = localData ? JSON.parse(localData) : [];

    employees.push(newEmployee);

    localStorage.setItem('employee', JSON.stringify(employees));
  }

  deleteEmployees(data: IListEmployee[]): void {
    localStorage.setItem('employee', JSON.stringify(data));
  }

  updateEmployee(updatedEmployee: IListEmployee): void {
    const localData = localStorage.getItem('employee');
    const employees: IListEmployee[] = localData ? JSON.parse(localData) : [];

    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);

    if (index === -1) {
      return;
    }

    employees[index] = {
      ...employees[index],
      ...updatedEmployee,
      id: employees[index].id
    };

    localStorage.setItem('employee', JSON.stringify(employees));
  }

}
