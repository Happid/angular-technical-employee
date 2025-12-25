import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { IListEmployee } from '../../models/employee.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [FormsModule, RouterLink],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit{

  employees: IListEmployee[] = [];
  filteredEmployees: IListEmployee[] = [];
  pagedEmployees: IListEmployee[] = [];

  searchName: string = '';
  searchGroup: string = '';

  sortField: keyof IListEmployee = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.getAllEmployee();
  }
  
  getAllEmployee(){
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data.employee;
      this.applyFilter()
    });
  }

  applyFilter(): void {
    let data = [...this.employees];

    data = data.filter(emp =>
      emp.firstName.toLowerCase().includes(this.searchName.toLowerCase()) &&
      emp.group.toLowerCase().includes(this.searchGroup.toLowerCase())
    );

    data.sort((a, b) => {
      const aVal = a[this.sortField];
      const bVal = b[this.sortField];

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredEmployees = data;

    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.setPage(1);
  }

  setPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEmployees = this.filteredEmployees.slice(start, end);
  }

  changeSort(field: keyof IListEmployee): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  changePageSize(event: any): void {
    this.pageSize = Number(event.target.value);
    this.applyFilter();
  }

}
