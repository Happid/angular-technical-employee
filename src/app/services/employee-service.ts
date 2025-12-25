import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  
  private readonly DATA_URL = 'assets/data/employees.json';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee> {
    return this.http.get<Employee>(this.DATA_URL);
  }
  
}
