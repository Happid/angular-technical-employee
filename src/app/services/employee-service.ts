import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  
  private readonly DATA_URL = 'mockup/employees.json';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<IEmployee> {
    return this.http.get<IEmployee>(this.DATA_URL);
  }
  
}
