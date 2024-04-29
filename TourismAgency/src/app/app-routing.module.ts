import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AdminComponent } from './component/admin/admin.component';
import { BlankComponent } from './component/blank/blank.component';
import { ContactComponent } from './component/contact/contact.component';
import { DestinationsComponent } from './component/destinations/destinations.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ReservationsComponent } from './component/reservations/reservations.component';
import { RoleGuard } from './role.guard';

const routes: Routes = [
	{ path: '', component: HomeComponent, data: { animation: 'isLeft' } },
	{ path: 'Destinations', component: DestinationsComponent, data: { animation: 'isPage1' } },
	{ path: 'Contact', component: ContactComponent, data: { animation: 'isPage2' } },
	{ path: 'Admin', component: AdminComponent, canActivate: [RoleGuard], data: { animation: 'isPage3' } },
	{ path: 'Reservations', component: ReservationsComponent, canActivate: [RoleGuard], data: { animation: 'isPage4' } },
	{ path: 'Login', component: LoginComponent, canActivate: [AuthGuard], data: { animation: 'isRight' } },
	{ path: 'Register', component: RegisterComponent, canActivate: [AuthGuard], data: { animation: 'isRight' } },
	{ path: 'Blank', component: BlankComponent, data: { animation: 'isRight' } }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
