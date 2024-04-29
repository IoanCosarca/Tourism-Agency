import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CarouselComponent } from "../../carousel/carousel.component";

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CarouselComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	images = [
		{
			imageSrc:
				'https://images.unsplash.com/photo-1460627390041-532a28402358?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
			imageAlt: 'nature1',
		},
		{
			imageSrc:
				'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
			imageAlt: 'nature2',
		},
		{
			imageSrc:
				'https://images.unsplash.com/photo-1640844444545-66e19eb6f549?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
			imageAlt: 'person1',
		},
		{
			imageSrc:
				'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
			imageAlt: 'person2',
		},
	]

	constructor(private router: Router) { }

	redirectToDestinations() {
		this.router.navigate(['/Destinations']);
	}
}