import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { slider } from './route-animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [slider]
})
export class AppComponent implements OnInit {
	title = 'Tourism Agency';

	searchQuery: string = '';

	constructor(private router: Router) { }

	ngOnInit(): void {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				if (this.router.url !== '/Destinations') {
					sessionStorage.removeItem('searchQuery');
				}
			}
		});
	}

	prepareRoute(outlet: RouterOutlet) {
		if (this.searchQuery.trim() !== '') {
			return '/Destinations';
		}
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
	}

	scrollTo(fragment: string): void {
		const element = document.getElementById(fragment);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	clearSearch() {
		this.searchQuery = '';
	}

	isLoggedIn(): boolean {
		return !!sessionStorage.getItem('currentUser');
	}

	isAgent(): boolean {
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
		return currentUser.role === 'AGENT';
	}

	logout(): void {
		sessionStorage.clear();
		this.router.navigate(['/Blank']).then(() => {
			setTimeout(() => {
				this.router.navigate(['/']);
			}, 2500);
		});
	}

	searchDestinations(query: string): void {
		this.router.navigate(['/Destinations'], { queryParams: { query: query } });
	}
}
