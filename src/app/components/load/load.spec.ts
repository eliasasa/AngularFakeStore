import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load } from './load';

describe('Load', () => {
  let component: Load;
  let fixture: ComponentFixture<Load>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Load]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
