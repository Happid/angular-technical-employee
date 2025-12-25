export interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: 'ACTIVE' | 'INACTIVE';
  group: string;
  description: string;
}
