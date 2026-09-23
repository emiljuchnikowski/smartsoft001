import { Route } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { LoginPage } from './auth/login.page';
import { NotesModule } from './notes/notes.module';

// #region routes
export const appRoutes: Route[] = [
  { path: 'login', component: LoginPage },
  // `NotesModule` brings the generated routes: '' (list), 'add' and ':id'.
  {
    path: 'notes',
    canActivate: [authGuard],
    loadChildren: () => NotesModule,
  },
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  { path: '**', redirectTo: 'notes' },
];
// #endregion
