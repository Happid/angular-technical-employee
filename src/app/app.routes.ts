import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { AuthGuard } from './guards/auth.guard';
import { AddEmployee } from './pages/employee/add-employee/add-employee';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: Login },
    { 
        path: "employee", 
        component: Employee,
        canActivate: [AuthGuard]
    },
    { 
        path: "employee/add", 
        component: AddEmployee,
        canActivate: [AuthGuard]
    },
    { 
        path: "employee/:id", 
        component: AddEmployee,
        canActivate: [AuthGuard]
    },
    { path: "**", redirectTo: "login" }
];
