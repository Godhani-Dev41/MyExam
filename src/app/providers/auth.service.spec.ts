import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { UserComponent } from '../user/user.component';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule.forRoot([
        {
          path: 'user',
          component: UserComponent
        },
        {
          path: 'dashboard',
          component: DashboardComponent
        },
        {
          path: 'login',
          component: LoginComponent
        }
      ])]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('populate', () => {
    it('should set isAuthenticatedSubject to true if user is available', () => {
      const user = { email: 'user@gmail.com', name: 'User' }
      const fnNext = spyOn(service.isAuthenticatedSubject, 'next');
      localStorage.setItem('user', JSON.stringify(user));
      service.populate();
      expect(fnNext).toHaveBeenCalledWith(true);
    });

    it('should set isAuthenticatedSubject to false if user is not available', () => {
      const fnNext = spyOn(service.isAuthenticatedSubject, 'next');
      localStorage.removeItem('user');
      service.populate();
      expect(fnNext).toHaveBeenCalledWith(false);
    });

    it('should set isAuthenticatedSubject to false if user is null', () => {
      const fnNext = spyOn(service.isAuthenticatedSubject, 'next');
      localStorage.setItem('user', 'null');
      service.populate();
      expect(fnNext).toHaveBeenCalledWith(false);
    });
  });

  describe('getUsers', () => {
    it('should get users data from API', () => {
      const users = [
        {
          name: 'user1', email: 'user1@gmail.com'
        },
        {
          name: 'user2', email: 'user2@gmail.com'
        }
      ]
      spyOn(service['http'], 'get').and.returnValue(of(users));
      const result = service.getUsers();
      result.subscribe(data => {
        expect(data).toEqual(users);
      })
    });
  });

  describe('login', () => {
    it('should set data in local storage', () => {
      const users = [
        {
          name: 'user1', email: 'user1@gmail.com'
        },
        {
          name: 'user2', email: 'user2@gmail.com'
        }
      ]
      service.login(users);
      const data = localStorage.getItem('user')
      expect(JSON.parse(data)).toEqual(users);
    });

    it('should set set isAuthenticatedSubject to true', () => {
      const fnNext = spyOn(service.isAuthenticatedSubject, 'next');
      const users = { role: 'admin' }
      service.login(users);
      expect(fnNext).toHaveBeenCalledWith(true);
    });

    it('should navigate to dashboard if role is admin', () => {
      const fnNavigateByUrl = spyOn(service['router'], 'navigateByUrl');
      const data = { role: 'admin' }
      const url = data.role == 'admin' ? '/dashboard' : '/user';
      service.login(data);
      expect(fnNavigateByUrl).toHaveBeenCalledWith(url);
    });

    it('should navigate to user if role is not admin', () => {
      const fnNavigateByUrl = spyOn(service['router'], 'navigateByUrl');
      const data = { role: 'user' }
      const url = data.role == 'admin' ? '/dashboard' : '/user';
      service.login(data);
      expect(fnNavigateByUrl).toHaveBeenCalledWith(url);
    });
  });

  describe('logOut', () => {
    it('should remove item from local storage and navigate to login', () => {
      const fnNext = spyOn(service.isAuthenticatedSubject, 'next');
      const fnNavigateByUrl = spyOn(service['router'], 'navigateByUrl');
      service.logOut();
      expect(fnNext).toHaveBeenCalledWith(false);
      expect(fnNavigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('updateUser', () => {
    it('should update user', () => {
      const body = {
        id: '123456', name: 'user1', email: 'user1@gmail.com'
      };

      const fnPut = spyOn(service['http'], 'put');
      service.updateUser(body);
      expect(fnPut).toHaveBeenCalledWith(environment.api_url + '/login/update/' + body.id,
        body)
    });
  });

  describe('updateExam', () => {
    it('should update exam', () => {
      const body = {
        id: '12345', name: 'user1', email: 'user1@gmail.com'
      }
      const fnPut = spyOn(service['http'], 'put');
      service.updateUser(body);
      expect(fnPut).toHaveBeenCalledWith(environment.api_url + '/login/update/' + body.id,
        body)
    });
  });

  describe('getLoggedInUser', () => {
    it('should return user data', () => {
      const user = { id: '12345', name: 'user1', email: 'user1@gmail.com' }
      localStorage.setItem('user', JSON.stringify(user));
      const result = service.getLoggedInUser();
      expect(result).toEqual(user)
    });

    it('should return null if no user data available', () => {
      localStorage.removeItem('user');
      const result = service.getLoggedInUser();
      expect(result).toEqual(null)
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if userdata stored in local storage', () => {
      const user = { id: '12345', name: 'user1', email: 'user1@gmail.com' }
      localStorage.setItem('user', JSON.stringify(user));
      const result = service.isAuthenticated();
      expect(result).toBeTruthy();
    });

    it('should return false if userdata not available in local storage', () => {
      localStorage.removeItem('user');
      const result = service.isAuthenticated();
      expect(result).toBeFalsy();
    });
  });

  describe('getExams', () => {
    it('should return exams data from API', () => {
      const exams = [
        {
          id: 1, name: 'exam1'
        },
        {
          id: 2, name: 'exam2'
        }
      ]
      spyOn(service['http'], 'get').and.returnValue(of(exams));
      const result = service.getExams();
      result.subscribe(data => {
        expect(data).toEqual(exams);
      })
    });
  });
});
