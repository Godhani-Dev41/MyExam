import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HiwComponent } from './hiw/hiw.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './providers/auth.guard';
import { ExamsResolver } from './providers/exams.resolver';
import { IsAdminGuard } from './providers/is-admin.guard';
import { IsStudentGuard } from './providers/is-student.guard';
import { UsersResolver } from './providers/users.resolver';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'how-it-works',
    component: HiwComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      users: UsersResolver,
    },
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard, IsStudentGuard],
    resolve: {
      exams: ExamsResolver,
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, IsAdminGuard],
    data: {
      isAdmin: true,
    },
    resolve: {
      exams: ExamsResolver,
      users: UsersResolver,
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UsersResolver, ExamsResolver],
})
export class AppRoutingModule { }
