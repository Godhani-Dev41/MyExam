import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { IExam } from '../models/exam';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExamsResolver implements Resolve<any> {
  constructor(private auth: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let { isAdmin } = route.data;

    let user = this.auth.getLoggedInUser();

    return this.auth.getExams().pipe(
      map((exams: IExam[]) => {
        if (isAdmin) {
          return exams;
        }

        return exams.filter((exam) => exam.details.student.id == user.id);
      })
    );
  }
}
