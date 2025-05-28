import { TestBed } from '@angular/core/testing';

import { EnviarFormService } from './enviar-form.service';

describe('EnviarFormService', () => {
  let service: EnviarFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviarFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
