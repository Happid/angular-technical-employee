import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee implements OnInit{

  employeeForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  // 10 dummy group
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

  filteredGroups: string[] = [];
  groupSearch: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredGroups = this.groups;

    this.employeeForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: ['', [Validators.required]],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  filterGroup(): void {
    this.filteredGroups = this.groups.filter(g =>
      g.toLowerCase().includes(this.groupSearch.toLowerCase())
    );
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const newEmployee = {
      id: uuidv4(),
      ...this.employeeForm.value
    };

    console.log('SAVE EMPLOYEE:', newEmployee);

    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    this.router.navigate(['/employee']);
  }

}
