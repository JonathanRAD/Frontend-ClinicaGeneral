import { TestBed } from '@angular/core/testing';

import { Laboratorio } from './laboratorio';

describe('Laboratorio', () => {
  let service: Laboratorio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Laboratorio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
