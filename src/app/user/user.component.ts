import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import { IExam } from '../models/exam';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  exams: IExam[];
  passwordChangeForm: FormGroup;
  user: IExam;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.exams = this.route.snapshot.data.exams;

    if (this.exams && this.exams.length) {
      this.user = this.exams[0];
    }

    let user = this.auth.getLoggedInUser();

    this.passwordChangeForm = this.fb.group(
      {
        id: [user?.id, Validators.required],
        username: [user?.username, Validators.required],
        role: [user?.role, Validators.required],
        password: [null, Validators.required],
        retype_password: [null, Validators.required],
      },
      {
        validator: this.confirmPassword,
      }
    );
  }

  onSubmitForm() {
    if (!this.passwordChangeForm.valid) {
      return alert('form is not valid');
    }

    let { password } = this.passwordChangeForm.value;

    this.auth
      .updateUser({
        ...this.passwordChangeForm.value,
        passwordHash: Md5.hashStr(password),
      })
      .subscribe((data) => {
        this.toastr.success('your password is changed. please login again');
        this.auth.logOut();
      });
  }

  confirmPassword(c: AbstractControl): { invalid: boolean; mismatch: boolean } {
    if (c.get('password') && c.get('retype_password')) {
      return c.get('password').value !== c.get('retype_password').value
        ? { invalid: true, mismatch: true }
        : null;
    } else {
      return { invalid: true, mismatch: true };
    }
  }
}
