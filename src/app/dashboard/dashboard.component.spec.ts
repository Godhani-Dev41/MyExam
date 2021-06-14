import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { IExam } from '../models/exam';
import { AuthService } from '../providers/auth.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [BrowserAnimationsModule, HttpClientModule, MatTableModule, MatPaginatorModule, FormsModule, ToastrModule.forRoot(), ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [AuthService, ToastrService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set exams and users data from snapshot data', () => {
      const users = [
        { email: 'user@gmail.com', password: 'User@123' }
      ]
      const exams: any = [
        { id: '123456', name: 'Exam1' }
      ]
      component['route'].snapshot.data = { users, exams };
      component.ngOnInit();

      expect(component.users).toEqual(users);
      expect(component.exams).toEqual(exams);
    });

    it('should set data source and paginator data source', () => {
      component.ngOnInit();
      // expect(component.dataSource).toBe(new MatTableDataSource<IExam>(component.exams));
      // expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('changeStatus', () => {
    it('should update the user and display the success toastr message', () => {
      const fnSuccess = spyOn(component['toastr'], 'success');
      const e = { value: 94 };
      const exam: any = { details: { student: { id: 12 } } };
      const users = [
        {
          id: 12, name: 'User1', email: 'User1@gmail.com'
        }
      ]
      component.users = users;

      const status = +e.value;
      const user = component.users.find((u) => u.id == exam.details.student.id);

      spyOn(component['auth'], 'updateUser').and.returnValue(of({}));
      component.changeStatus(e, exam);
      expect(component['auth'].updateUser).toHaveBeenCalledOnceWith({ ...user, status })
      component['auth'].updateUser({ ...user, status }).subscribe(data => {
        expect(fnSuccess).toHaveBeenCalledWith('Successfully Updated User')
      })
    });

    it('should update the user and display the error toastr message', () => {
      const fnSuccess = spyOn(component['toastr'], 'success');
      const e = { value: 94 };
      const exam: any = { details: { student: { id: 12 } } };
      const users = [
        {
          id: 12, name: 'User1', email: 'User1@gmail.com'
        }
      ]
      component.users = users;

      const status = +e.value;
      const user = component.users.find((u) => u.id == exam.details.student.id);

      spyOn(component['auth'], 'updateUser').and.returnValue((throwError({ status: 404 })));
      component.changeStatus(e, exam);
      expect(component['auth'].updateUser).toHaveBeenCalledOnceWith({ ...user, status })
      component['auth'].updateUser({ ...user, status }).subscribe(data => {
        expect(fnSuccess).toHaveBeenCalledWith('Update failed')
      })
    });

    it('should update the exam and display the success toastr message', () => {
      const fnSuccess = spyOn(component['toastr'], 'success');
      const e = { value: 94 };
      const exam: any = { details: { student: { id: 12 } } };
      const users = [
        {
          id: 12, name: 'User1', email: 'User1@gmail.com'
        }
      ]
      component.users = users;

      const status = +e.value;
      let payload: IExam = { ...exam };
      payload.details.status = status;

      spyOn(component['auth'], 'updateExam').and.returnValue(of({}));
      component.changeStatus(e, exam);
      expect(component['auth'].updateExam).toHaveBeenCalledOnceWith(payload)
      component['auth'].updateUser(payload).subscribe(data => {
        expect(fnSuccess).toHaveBeenCalledWith('Successfully Updated Exam')
      })
    });

    it('should update the exam and display the success toastr message', () => {
      const fnSuccess = spyOn(component['toastr'], 'success');
      const e = { value: 94 };
      const exam: any = { details: { student: { id: 12 } } };
      const users = [
        {
          id: 12, name: 'User1', email: 'User1@gmail.com'
        }
      ]
      component.users = users;

      const status = +e.value;
      let payload: IExam = { ...exam };
      payload.details.status = status;

      spyOn(component['auth'], 'updateExam').and.returnValue((throwError({ status: 404 })));
      component.changeStatus(e, exam);
      expect(component['auth'].updateExam).toHaveBeenCalledOnceWith(payload)
      component['auth'].updateUser(payload).subscribe(data => {
        expect(fnSuccess).toHaveBeenCalledWith('Update failed')
      })
    });
  });
});
