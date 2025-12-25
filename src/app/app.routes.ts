import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Employee } from './pages/employee/employee';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: Login },
    { 
        path: "employee", 
        component: Employee,
        canActivate: [AuthGuard]
    },
    { path: "**", redirectTo: "login" }
];
