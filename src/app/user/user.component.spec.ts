import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../providers/auth.service';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [HttpClientModule, FormsModule, ToastrModule.forRoot(), ReactiveFormsModule, RouterModule.forRoot([{
        path: 'login',
        component: LoginComponent
      }])],
      providers: [ToastrService, AuthService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set exams data from route snapshot exams data', () => {
      const exams = [
        { id: 123, details: null }
      ]
      component['route'].snapshot.data = { exams };
      component.ngOnInit();

      expect(component.exams).toEqual(exams);
    });

    it('should set first exam as user if the exams is defined and has length', () => {
      component['route'].snapshot.data = { exams: 'null' };
      component.ngOnInit();

      const exams = [
        { id: 1, details: null },
        { id: 2, details: null },
      ]
      component['route'].snapshot.data = { exams };
      component.ngOnInit();

      expect(component.exams).toEqual(exams);
      expect(component.exams.length).toBeGreaterThan(0);
      expect(component.user).toEqual(component.exams[0]);
    });

    it('should create passwordChangeForm form', () => {
      spyOn(component['auth'], 'getLoggedInUser').and.returnValue(undefined);
      component.ngOnInit();
      expect(component.passwordChangeForm.controls.id).toBeTruthy();
      expect(component.passwordChangeForm.controls.username).toBeTruthy();
      expect(component.passwordChangeForm.controls.role).toBeTruthy();
      expect(component.passwordChangeForm.controls.password).toBeTruthy();
      expect(component.passwordChangeForm.controls.retype_password).toBeTruthy();
    });

    it('should create passwordChangeForm form and set default value', () => {
      const user = { id: '1234', username: 'User1', role: 'admin' };
      spyOn(component['auth'], 'getLoggedInUser').and.returnValue(user);
      component.ngOnInit();
      expect(component.passwordChangeForm.controls.id.value).toBe(user.id);
      expect(component.passwordChangeForm.controls.username.value).toBe(user.username);
      expect(component.passwordChangeForm.controls.role.value).toBe(user.role);
    });
  });

  describe('onSubmitForm', () => {
    it('should show alert if form is not valid', () => {
      const alert = spyOn(window, 'alert');
      component.onSubmitForm();
      expect(alert).toHaveBeenCalledWith('form is not valid')
    });

    it('should show success toastr if the user is updated', () => {
      const fnError = spyOn(component['toastr'], 'success');
      const fnLogOut = spyOn(component['auth'], 'logOut');
      component.passwordChangeForm.setValue({
        id: '123',
        username: 'User',
        role: 'Admin',
        password: '123456',
        retype_password: '123456'
      })
      spyOn(component['auth'], 'updateUser').and.returnValue(of([]))
      component.onSubmitForm();
      expect(fnError).toHaveBeenCalledWith('your password is changed. please login again');
      expect(fnLogOut).toHaveBeenCalled();
    });
  });

  describe('confirmPassword', () => {
    it('should return { invalid: true, mismatch: true } if password is not match', () => {
      component.ngOnInit();
      component.passwordChangeForm.setValue({
        id: '123',
        username: 'User',
        role: 'Admin',
        password: '123456',
        retype_password: '123'
      })
      const result = component.confirmPassword(component.passwordChangeForm)
      expect(result).toEqual({ invalid: true, mismatch: true });
    });

    it('should return { invalid: true, mismatch: true } if password field is undefined', () => {
      const passwordChangeForm = component['fb'].group(
        {
          password: [null, Validators.required],
        }
      );
      const result = component.confirmPassword(passwordChangeForm)
      expect(result).toEqual({ invalid: true, mismatch: true });
    });

    it('should return { invalid: true, mismatch: true } if retype_password field is undefined', () => {
      const passwordChangeForm = component['fb'].group(
        {
          retype_password: [null, Validators.required],
        }
      );
      const result = component.confirmPassword(passwordChangeForm)
      expect(result).toEqual({ invalid: true, mismatch: true });
    });

    it('should return { invalid: true, mismatch: true } if password not match', () => {
      component.ngOnInit();
      component.passwordChangeForm.setValue({
        id: '123',
        username: 'User',
        role: 'Admin',
        password: '123456',
        retype_password: '123'
      })
      const result = component.confirmPassword(component.passwordChangeForm)
      expect(result).toEqual({ invalid: true, mismatch: true });
    });

    it('should return null if password match', () => {
      component.ngOnInit();
      component.passwordChangeForm.setValue({
        id: '123',
        username: 'User',
        role: 'Admin',
        password: '123456',
        retype_password: '123456'
      })
      const result = component.confirmPassword(component.passwordChangeForm)
      expect(result).toBeNull();
    });
  });
});
