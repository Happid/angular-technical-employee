import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployee } from './detail-employee';

describe('DetailEmployee', () => {
  let component: DetailEmployee;
  let fixture: ComponentFixture<DetailEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
