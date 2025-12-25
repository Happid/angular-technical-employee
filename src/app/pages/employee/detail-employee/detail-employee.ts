import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IListEmployee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee-service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-employee',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './detail-employee.html',
  styleUrl: './detail-employee.css',
})
export class DetailEmployee implements OnInit{

  employee?: IListEmployee;
  queryParams: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.queryParams = this.route.snapshot.queryParams;

    if (id) {
      this.employeeService.getEmployees().subscribe(data => {
        this.employee = data.employee.find(emp => emp.id === id);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/employee'], {
      queryParams: this.queryParams
    });
  }

}
