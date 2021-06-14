import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), HttpClientModule],
      providers: [AuthService]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if user authenticated', () => {
      spyOn(guard['auth'], 'isAuthenticated').and.returnValue(true);
      const result = guard.canActivate(null, null);
      expect(guard['auth'].isAuthenticated).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return false and navigate to login if user not authenticated', () => {
      const fnNavigateByUrl = spyOn(guard['router'], 'navigateByUrl');
      spyOn(guard['auth'], 'isAuthenticated').and.returnValue(false);
      const result = guard.canActivate(null, null);
      expect(guard['auth'].isAuthenticated).toHaveBeenCalled();
      expect(result).toBeFalsy();
      expect(fnNavigateByUrl).toHaveBeenCalledWith('/login');
    });
  });
});
