import {
  Directive,
  Input, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[isLogged]',
})
export class IsLoggedDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private auth: AuthService,
    private viewContainer: ViewContainerRef
  ) {}

  @Input('isLogged') isLogged: boolean;

  ngOnInit(): void {
    this.auth.isAuthenticatedCheck.subscribe((isAuthenticated) => {
      if (
        (isAuthenticated && this.isLogged) ||
        (!isAuthenticated && !this.isLogged)
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
