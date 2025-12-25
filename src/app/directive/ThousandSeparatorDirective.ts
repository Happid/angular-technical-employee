import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[thousandSeparator]'
})
export class ThousandSeparatorDirective {

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let value = this.el.nativeElement.value;
    value = value.replace(/\D/g, '');
    this.control.control?.setValue(value, { emitEvent: false });
    this.el.nativeElement.value = this.format(value);
  }

  private format(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
