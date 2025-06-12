import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
      path: 'login',
      component: LoginComponent  
    },
    {
      path: 'cadastro',
      component: RegisterComponent
    },
    // {
    //   path: '**',
    //   component: Error  
    // },
];
