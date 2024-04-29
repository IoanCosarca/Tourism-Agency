import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class RoleGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(): boolean {
		const currentUser = sessionStorage.getItem('currentUser');

		if (currentUser) {
			const user = JSON.parse(currentUser);
			if (user && user.role === 'AGENT') {
				return true; // Allow access
			}
		}
		
		this.router.navigate(['/']);
		return false;
	}
}
