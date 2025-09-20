import { TestBed } from '@angular/core/testing';

import { SeguroMedico } from './seguro-medico';

describe('SeguroMedico', () => {
  let service: SeguroMedico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguroMedico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
