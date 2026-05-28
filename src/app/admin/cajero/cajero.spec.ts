import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroComponent } from './cajero';

describe('CajeroComponent', () => {
  let component: CajeroComponent;
  let fixture: ComponentFixture<CajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CajeroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
