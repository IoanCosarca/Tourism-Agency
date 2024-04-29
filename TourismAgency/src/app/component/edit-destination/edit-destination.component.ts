import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DestinationModel } from '../../model/destination.model';
import { UpdateDestinationModel } from '../../model/update-destination.model';
import { DestinationService } from '../../service/destination.service';

@Component({
	selector: 'app-edit-destination',
	standalone: true,
	imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
	templateUrl: './edit-destination.component.html',
	styleUrl: './edit-destination.component.css'
})
export class EditDestinationComponent implements OnInit {
	destinations: DestinationModel[] = [];

	editLocation: boolean = false;
	editDescription: boolean = false;
	editPriceNight: boolean = false;
	editSpots: boolean = false;
	editDiscountPercent: boolean = false;

	editLocationIndex: number = -1;
	editDescriptionIndex: number = -1;
	editPriceNightIndex: number = -1;
	editSpotsIndex: number = -1;
	editDiscountPercentIndex: number = -1;

	updateInformation: UpdateDestinationModel = {
		name: '',
		location: '',
		description: '',
		pricePerNight: '',
		spots: 0,
		discount: 0
	}

	isEditing: boolean = false;

	constructor(private destinationService: DestinationService) { }

	ngOnInit(): void {
		this.getDestinations();
	}

	getDestinations(): void {
		this.destinationService.getDestinations().subscribe(
			(destinations: DestinationModel[]) => {
				this.destinations = destinations.sort((a, b) => a.name.localeCompare(b.name));
			},
			(error: any) => {
				console.error('Failed to fetch destinations:', error);
			}
		);
	}

	enableEdit(field: string, index: number) {
		this.isEditing = true;

		switch (field) {
			case 'location':
				this.editLocation = true;
				this.editLocationIndex = index;
				break;
			case 'description':
				this.editDescription = true;
				this.editDescriptionIndex = index;
				break;
			case 'priceNight':
				this.editPriceNight = true;
				this.editPriceNightIndex = index;
				break;
			case 'spots':
				this.editSpots = true;
				this.editSpotsIndex = index;
				break;
			case 'discountPercent':
				this.editDiscountPercent = true;
				this.editDiscountPercentIndex = index;
				break;
		}
	}

	cancelEdit() {
		this.isEditing = false;
		this.editLocation = false;
		this.editDescription = false;
		this.editPriceNight = false;
		this.editSpots = false;
		this.editDiscountPercent = false;
		this.resetEditIndexes();
	}

	saveEdit(field: string) {
		if (!this.isEditing) {
			console.error('No destination selected for editing.');
			return;
		}

		const index = this.getIndexForField(field);
		if (index === -1) {
			console.error('Invalid index for field:', field);
			return;
		}

		const destination = this.destinations[index];
		if (!destination) {
			console.error('Destination not found at index:', index);
			return;
		}

		this.updateInformation.name = destination.name;
		this.updateInformation.location = destination.location;
		this.updateInformation.description = destination.description;
		this.updateInformation.pricePerNight = destination.pricePerNight;
		this.updateInformation.spots = destination.spots;
		this.updateInformation.discount = destination.discount;

		switch (field) {
			case 'location':
				this.destinationService.updateDestination(destination.name, this.updateInformation).subscribe(
					response => {
						console.log('Location updated successfully:', response);
					},
					error => {
						console.error('Failed to update location:', error);
					}
				);
				break;
			case 'description':
				this.destinationService.updateDestination(destination.name, this.updateInformation).subscribe(
					response => {
						console.log('Description updated successfully:', response);
					},
					error => {
						console.error('Failed to update description:', error);
					}
				);
				break;
			case 'priceNight':
				this.destinationService.updateDestination(destination.name, this.updateInformation).subscribe(
					response => {
						console.log('Price/Night updated successfully:', response);
					},
					error => {
						console.error('Failed to update price/night:', error);
					}
				);
				break;
			case 'spots':
				this.destinationService.updateDestination(destination.name, this.updateInformation).subscribe(
					response => {
						console.log('Spots updated successfully:', response);
					},
					error => {
						console.error('Failed to update spots:', error);
					}
				);
				break;
			case 'discountPercent':
				this.destinationService.updateDestination(destination.name, this.updateInformation).subscribe(
					response => {
						console.log('Discount updated successfully:', response);
					},
					error => {
						console.error('Failed to update discount:', error);
					}
				);
				break;
		}

		this.cancelEdit();
	}

	private getIndexForField(field: string): number {
		switch (field) {
			case 'location':
				return this.editLocationIndex;
			case 'description':
				return this.editDescriptionIndex;
			case 'priceNight':
				return this.editPriceNightIndex;
			case 'spots':
				return this.editSpotsIndex;
			case 'discountPercent':
				return this.editDiscountPercentIndex;
			default:
				return -1;
		}
	}

	deleteDestination(name: string, index: number) {
		this.destinationService.deleteDestinationByName(name).subscribe(
			response => {
				console.log('Destination deleted successfully:', response);
				this.destinations.splice(index, 1);
			},
			error => {
				console.error('Failed to delete destination:', error);
			}
		);
	}

	private resetEditIndexes() {
		this.editLocationIndex = -1;
		this.editDescriptionIndex = -1;
		this.editPriceNightIndex = -1;
		this.editSpotsIndex = -1;
		this.editDiscountPercentIndex = -1;
	}
}
