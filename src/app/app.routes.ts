import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { Profile } from './views/profile/profile';
import { Logout } from './components/logout/logout';
import { Products } from './views/products/products';
import { Categories } from './views/categories/categories';
import { Cart } from './views/cart/cart';

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
    {
      path: 'perfil',
      component: Profile
    },
    {
      path: 'logout',
      component: Logout
    },
    {
      path: 'produto/:id',
      component: Products
    },
    {
      path: 'categorias/:bind',
      component: Categories
    },
    {
      path: 'categorias',
      component: Categories
    },
    {
      path: 'carrinho',
      component: Cart
    }
    // {
    //   path: '**',
    //   component: Error  
    // },
];
