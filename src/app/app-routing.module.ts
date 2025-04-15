import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { profileGuard } from './guards/profile.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/splash', // Redirige a splash en la raíz
    pathMatch: 'full',     // Asegura que solo coincida con la ruta raíz
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [authGuard, profileGuard],
  },
  
 
  {
    path: 'tab3',
    loadChildren: () =>
      import('./tab3/tab3.module').then((m) => m.Tab3PageModule),
  },
  {
    path: 'tab2',
    loadChildren: () =>
      import('./tab2/tab2.module').then((m) => m.Tab2PageModule),
  },
 

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
