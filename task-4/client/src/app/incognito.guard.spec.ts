import { TestBed, async, inject } from '@angular/core/testing';

import { IncognitoGuard } from './incognito.guard';

describe('IncognitoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncognitoGuard]
    });
  });

  it('should ...', inject([IncognitoGuard], (guard: IncognitoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
