import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { IListEmployee } from '../../models/employee.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  imports: [
    FormsModule, 
    RouterLink,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit{

  employees: IListEmployee[] = [];
  filteredEmployees: IListEmployee[] = [];
  pagedEmployees: IListEmployee[] = [];

  searchName: string = '';
  searchGroup: string = '';

  sortField: keyof IListEmployee = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.sortField = 'createdAt';
    this.route.queryParams.subscribe(params => {
      this.searchName = params['name'] || '';
      this.searchGroup = params['group'] || '';
      this.currentPage = +params['page'] || 1;
      this.pageSize = +params['size'] || 10;

      this.getAllEmployee();
    });
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
      if (this.sortField === 'createdAt') {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return this.sortDirection === 'asc'
          ? aDate - bDate
          : bDate - aDate;
      }

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

  goToDetail(emp: IListEmployee): void {
    this.router.navigate(['/employee', emp.id], {
      queryParams: {
        name: this.searchName,
        group: this.searchGroup,
        page: this.currentPage,
        size: this.pageSize
      }
    });
  }

  onDelete(emp: IListEmployee): void {
    const confirmed = confirm(
      `Apakah anda yakin ingin menghapus employee ${emp.firstName} ${emp.lastName}?`
    );
    if (!confirmed) return;

    this.employees = this.employees.filter(e => e.id !== emp.id);
    this.employeeService.deleteEmployees(this.employees);
    this.applyFilter();
    this.toastr.success(
      `Employee ${emp.firstName} berhasil dihapus`,
      'Delete'
    );
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
