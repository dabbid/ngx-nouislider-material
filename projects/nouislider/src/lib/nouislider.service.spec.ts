import { TestBed, inject } from '@angular/core/testing';

import { NouisliderService } from './nouislider.service';

describe('NouisliderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NouisliderService]
    });
  });

  it('should be created', inject([NouisliderService], (service: NouisliderService) => {
    expect(service).toBeTruthy();
  }));
});
