import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../providers/auth.service';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterModule.forRoot([]), FormsModule, ToastrModule.forRoot(), ReactiveFormsModule, HttpClientModule],
      providers: [AuthService, ToastrService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set users from route snapshot users data', () => {
      const users = [
        { email: 'user@gmail.com', password: 'User@123' }
      ]
      component['route'].snapshot.data = { users };
      component.ngOnInit();

      expect(component.users).toEqual(users);
    });

    it('should create login form with email and password fields with default value', () => {
      component.ngOnInit();
      expect(component.loginForm.controls.email).toBeTruthy();
      expect(component.loginForm.controls.password).toBeTruthy();
      expect(component.loginForm.value).toEqual({ email: 'jackb', password: 'password' });
    });
  })

  describe('onSubmitForm', () => {
    it('should return null if the login form is not valid', () => {
      component.loginForm.disable();
      const result = component.onSubmitForm();
      expect(result).toBeNull();
    });

    it(`should show toastr 'No user found' if no user found`, () => {
      const fnError = spyOn(component['toastr'], 'error')
      component.ngOnInit();
      component.loginForm.setValue({ email: 'user@gmail.com', password: 'User@123' });
      component.users = [
        { username: 'user2@gmail.com', password: 'User@123' }
      ]
      component.onSubmitForm();
      expect(fnError).toHaveBeenCalledWith('No user found!')
    });

    it(`should show toastr 'Please contact Admin to login!' if user hasn't status`, () => {
      const fnError = spyOn(component['toastr'], 'error')
      component.ngOnInit();
      component.loginForm.setValue({ email: 'user@gmail.com', password: 'User@123' });
      component.users = [
        { username: 'user@gmail.com', password: 'User@123', status: undefined }
      ]
      component.onSubmitForm();
      expect(fnError).toHaveBeenCalledWith('Please contact Admin to login!')
    });

    it(`should login user if password match`, () => {
      const fnLogin = spyOn(component['auth'], 'login')
      component.ngOnInit();
      component.loginForm.setValue({ email: 'user@gmail.com', password: 'User@123' });
      const user = { username: 'user@gmail.com', password: Md5.hashStr('User@123'), passwordHash: Md5.hashStr('User@123'), status: 'active' }

      component.users = [
        user
      ]
      component.onSubmitForm();
      expect(fnLogin).toHaveBeenCalledWith(user)
    });

    it(`should 'Password doesn't match' error if password not match`, () => {
      const fnError = spyOn(component['toastr'], 'error')
      component.ngOnInit();
      component.loginForm.setValue({ email: 'user@gmail.com', password: 'User@123' });
      const user = { username: 'user@gmail.com', password: Md5.hashStr('User@12345'), status: 'active' }

      component.users = [
        user
      ]
      component.onSubmitForm();
      expect(fnError).toHaveBeenCalledWith(`Password doesn't match`)
    });
  });
});
