import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { EmployeeService } from '../../../services/employee-service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { FormError, maxDateToday } from '../../../components/form-error/form-error';
import { ThousandSeparatorDirective } from '../../../directive/ThousandSeparatorDirective';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, FormsModule, NgClass, FormError, ThousandSeparatorDirective],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee implements OnInit{

  employeeForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  groups: string[] = [
    'Engineering',
    'Human Resource',
    'Finance',
    'Marketing',
    'Sales',
    'Operation',
    'IT Support',
    'Legal',
    'Product',
    'Management'
  ];
  open = false;
  filteredGroups: string[] = [...this.groups];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.filteredGroups = this.groups;

    this.employeeForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, maxDateToday]],
      basicSalary: ['', [Validators.required]],
      status: [true, Validators.required],
      group: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  filterGroup(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredGroups = this.groups.filter(g =>
      g.toLowerCase().includes(value)
    );
  }

  selectGroup(group: string) {
    this.employeeForm.get('group')?.setValue(group);
    this.open = false;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const newEmployee = {
      id: uuidv4(),
      ...this.employeeForm.value,
      status: this.employeeForm.status ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date().toISOString()
    };

    this.employeeService.addEmployee(newEmployee);
    this.toastr.success('Data Karyawan Berhasil Ditambah', 'Suksess');
    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }

  get disabledBtn(){
    const statusValidator = this.filteredGroups.length === 0 || this.open;
    const inputValidator = this.employeeForm.get('username')?.invalid ||
     this.employeeForm.get('firstName')?.invalid ||
     this.employeeForm.get('lastName')?.invalid ||
     this.employeeForm.get('email')?.invalid ||
     this.employeeForm.get('birthDate')?.invalid ||
     this.employeeForm.get('basicSalary')?.invalid ||
     this.employeeForm.get('group')?.invalid ||
     this.employeeForm.get('description')?.invalid;
    
    if(inputValidator || statusValidator){
      return true;
    }
    return false;
  }

}
