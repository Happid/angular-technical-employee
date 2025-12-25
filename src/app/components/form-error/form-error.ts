import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.css',
})
export class FormError {
  @Input() control!: AbstractControl | null;
}

export function maxDateToday(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const inputDate = new Date(control.value);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate > today
    ? { maxDate: true }
    : null;
}
