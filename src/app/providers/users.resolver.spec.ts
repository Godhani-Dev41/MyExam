import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientModule, RouterModule.forRoot([])]
    });
    resolver = TestBed.inject(UsersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should be return users', () => {
    const result = resolver.resolve(null, null);
    expect(result).toBeTruthy(resolver['auth'].getUsers());
  });
});
