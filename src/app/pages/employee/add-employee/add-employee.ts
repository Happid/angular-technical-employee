import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { EmployeeService } from '../../../services/employee-service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { FormError, maxDateToday } from '../../../components/form-error/form-error';
import { ThousandSeparatorDirective } from '../../../directive/ThousandSeparatorDirective';
import { IListEmployee } from '../../../models/employee.model';

@Component({
  selector: 'app-add-employee',
  imports: [ReactiveFormsModule, FormsModule, NgClass, FormError, ThousandSeparatorDirective],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee implements OnInit{

  employee?: IListEmployee;
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
  isEditMode: boolean = false;
  employeeId: string | null = null;
  queryParams: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.filteredGroups = this.groups;

    const id = this.route.snapshot.paramMap.get('id');
    this.queryParams = this.route.snapshot.queryParams;
    if (id) {
      this.isEditMode = true;
      this.employeeId = id;
      this.loadEmployee(id);
    }
  }

  formatCurrency(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  initForm(){
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

  loadEmployee(id: string): void {
    this.employeeService.getEmployees().subscribe(res => {
      const emp = res.employee.find(e => e.id === id);
      if (!emp) return;

      this.employeeForm.patchValue({
        username: emp.username,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        birthDate: emp.birthDate.split('T')[0],
        basicSalary: this.formatCurrency(emp.basicSalary.toString()),
        status: emp.status === 'ACTIVE',
        group: emp.group,
        description: emp.description,
      });
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
      status: this.employeeForm.get('status')?.value ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date().toISOString()
    };
   
    if (this.isEditMode) {
      this.updateEmployee(newEmployee);
    } else {
      this.addEmployee(newEmployee);
    }
  }

  updateEmployee(data: any): void {
    const rawSalary = this.employeeForm.value.basicSalary.replace(/\./g, '');
    const payload: IListEmployee = {
      ...data,
      id: this.employeeId,
      status: this.employeeForm.get('status')?.value ? 'ACTIVE' : 'INACTIVE',
      createdAt: this.employee?.createdAt ?? new Date().toISOString(),
      basicSalary: Number(rawSalary)
    };
   
    this.employeeService.updateEmployee(payload);
    this.toastr.success('Data Karyawan Berhasil Diperbarui', 'Sukses');
    this.router.navigate(['/employee'], {
      queryParams: this.queryParams
    });
  }

  addEmployee(data: any){
    this.employeeService.addEmployee(data);
    this.toastr.success('Data Karyawan Berhasil Ditambah', 'Suksess');
    this.router.navigate(['/employee']);
  }

  onCancel(): void {
    if(this.isEditMode){
      this.router.navigate(['/employee'], {
        queryParams: this.queryParams
      });
    }else{
      this.router.navigate(['/employee']);
    }
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
