import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosComponent } from './eventos';

describe('Eventos', () => {
  let component: EventosComponent;
  let fixture: ComponentFixture<EventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
