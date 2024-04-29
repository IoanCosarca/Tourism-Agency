import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { DestinationModel } from '../../model/destination.model';
import { ReservationModel } from '../../model/reservation.model';
import { ResponseModel } from '../../model/response.model';
import { UpdateDestinationModel } from '../../model/update-destination.model';
import { DestinationService } from '../../service/destination.service';
import { ReservationService } from '../../service/reservation.service';

import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-destinations',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatNativeDateModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatIconModule
	],
	templateUrl: './destinations.component.html',
	styleUrls: ['./destinations.component.css']
})
export class DestinationsComponent implements OnInit {
	destinations: DestinationModel[] = [];

	destinationsWithDiscount: any[] = [];
	destinationsWithoutDiscount: any[] = [];

	dateRangeForm = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

	currentUser: any;

	reservationData: ReservationModel = {
		user: 0,
		destination: 0,
		date: "",
		start_date: "",
		end_date: "",
		totalPrice: ""
	}

	reservationMessage: string = "";

	constructor(
		private snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private destinationService: DestinationService,
		private reservationService: ReservationService
	) { }

	ngOnInit(): void {
		const currentUserString = sessionStorage.getItem('currentUser');
		this.currentUser = currentUserString ? JSON.parse(currentUserString) : null;

		this.route.queryParams.subscribe(params => {
			const searchQuery = params['query'];
			if (searchQuery) {
				this.searchDestinations(searchQuery);
			} else {
				this.getDestinations();
			}
		});
	}

	getDestinations(): void {
		this.destinationService.getDestinations().subscribe(
			(destinations: DestinationModel[]) => {
				this.destinations = destinations;
				this.destinations.sort((a, b) => a.name.localeCompare(b.name));
				this.categorizeDestinations();
			},
			(error: any) => {
				console.error('Failed to fetch destinations:', error);
			}
		);
	}

	searchDestinations(query: string): void {
		sessionStorage.setItem('searchQuery', query);
		const searchByName$ = this.destinationService.searchDestinationByName(query);
		const searchByLocation$ = this.destinationService.searchDestinationByLocation(query);

		forkJoin([searchByName$, searchByLocation$]).subscribe(
			(results: [DestinationModel[], DestinationModel[]]) => {
				const [destinationsByName, destinationsByLocation] = results;
				this.destinations = [...destinationsByName, ...destinationsByLocation];
				this.destinations.sort((a, b) => a.name.localeCompare(b.name));
				this.categorizeDestinations();
			},
			(error: any) => {
				console.error('Failed to search destinations:', error);
			}
		);
	}

	categorizeDestinations(): void {
		this.destinationsWithDiscount = [];
		this.destinationsWithoutDiscount = [];
		this.destinations.forEach(dest => {
			if (dest.discount > 0) {
				this.destinationsWithDiscount.push(dest);
			} else {
				this.destinationsWithoutDiscount.push(dest);
			}
		});
	}

	makeReservation(destination: DestinationModel): void {
		// Check if start and end dates are selected
		const startDate = this.dateRangeForm.get('start')?.value;
		const endDate = this.dateRangeForm.get('end')?.value;
		if (!startDate || !endDate) {
			// Display error message if start or end date is not selected
			this.snackBar.open('Please select both start and end dates.', 'Close', {
				duration: 5000,
				panelClass: ['error-snackbar']
			});
			return;
		}

		// Handle possibly null currentUser
		const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
		if (!currentUser || !currentUser.id) {
			console.error('Current user not found or has no ID');
			return;
		}

		// Calculate total price based on selected date range and destination price/discount
		const totalPrice = this.calculateTotalPrice(startDate, endDate, destination);

		// Adjust dates to the format expected by Django (YYYY-MM-DD)
		const formatDateForDjango = (date: Date): string => formatDate(date, 'yyyy-MM-dd', 'en-US');

		// Prepare reservation data
		this.reservationData.user = currentUser.id;
		this.reservationData.destination = destination.id;
		this.reservationData.date = formatDateForDjango(new Date());
		this.reservationData.start_date = formatDateForDjango(startDate);
		this.reservationData.end_date = formatDateForDjango(endDate);
		this.reservationData.totalPrice = totalPrice.toFixed(2).toString();

		// Save reservation
		this.reservationService.saveReservation(this.reservationData).subscribe(
			(response: ResponseModel) => {
				this.reservationMessage = response.message;
				if (this.reservationMessage === "Reservation created successfully") {
					console.log('Reservation saved successfully:', response);
					// Update destination spots in the UI and database
					this.updateDestinationSpots(destination);
				}
			},
			error => {
				console.error('Failed to save reservation:', error);
			}
		);
	}

	calculateTotalPrice(startDate: Date, endDate: Date, destination: DestinationModel): number {
		// Parse pricePerNight to a numeric type
		const pricePerNight = parseFloat(destination.pricePerNight);

		// Calculate number of nights
		const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
		const nights = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));

		// Calculate total price based on discount
		const discountedPrice = pricePerNight - (pricePerNight * destination.discount / 100);
		const totalPrice = nights * discountedPrice;

		return totalPrice;
	}

	updateDestinationSpots(destination: DestinationModel): void {
		// Decrease the number of spots by 1
		destination.spots -= 1;

		const updateInformation: UpdateDestinationModel = {
			name: destination.name,
			location: destination.location,
			description: destination.description,
			pricePerNight: destination.pricePerNight,
			spots: destination.spots,
			discount: destination.discount
		}

		// Update destination in the database
		this.destinationService.updateDestination(destination.name, updateInformation).subscribe(
			() => {},
			error => {
				console.error('Failed to update destination spots:', error);
			}
		);
	}

	calculateDiscountedPrice(price: string, discount: number): string {
		return (Number(price) - (discount / 100 * Number(price))).toFixed(2);
	}
}
