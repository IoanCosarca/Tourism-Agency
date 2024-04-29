import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(): boolean {
		const currentUser = sessionStorage.getItem('currentUser');

		if (currentUser) {
			this.router.navigate(['/']);
			return false;
		}

		// User is not logged in, allow access
		return true;
	}
}
