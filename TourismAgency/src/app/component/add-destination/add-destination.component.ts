import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { CreateDestinationModel } from '../../model/create-destination.model';
import { ResponseModel } from '../../model/response.model';
import { DestinationService } from '../../service/destination.service';

@Component({
	selector: 'app-add-destination',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
	templateUrl: './add-destination.component.html',
	styleUrl: './add-destination.component.css'
})
export class AddDestinationComponent {
	destinationForm: FormGroup;

	destinationData: CreateDestinationModel = {
		name: '',
		location: '',
		image: null,
		description: '',
		pricePerNight: "0.00",
		spots: 0,
		discount: 0
	}

	@ViewChild('fileInput') fileInput!: ElementRef;

	imageUrl: string | ArrayBuffer | null = null;

	isDragging: boolean = false;

	destinationMessage: string = '';

	constructor(private formBuilder: FormBuilder, private destinationService: DestinationService, private router: Router) {
		this.destinationForm = this.formBuilder.group({
			name: ['', Validators.required],
			location: ['', Validators.required],
			image: ['', Validators.required],
			description: ['', Validators.required],
			pricePerNight: ['', Validators.required],
			spots: ['', Validators.required],
			discount: ['']
		});
	}

	submitForm() {
		if (this.destinationForm.valid) {
			this.destinationData.name = this.destinationForm.value.name;
			this.destinationData.location = this.destinationForm.value.location;
			this.destinationData.description = this.destinationForm.value.description;
			this.destinationData.pricePerNight = parseFloat(this.destinationForm.value.pricePerNight).toFixed(2);
			this.destinationData.spots = this.destinationForm.value.spots;
			this.destinationData.discount = this.destinationForm.value.discount;

			const formData = new FormData();
			formData.append('name', this.destinationData.name);
			formData.append('location', this.destinationData.location);
			formData.append('description', this.destinationData.description);
			formData.append('pricePerNight', this.destinationData.pricePerNight);
			formData.append('spots', this.destinationData.spots.toString());
			formData.append('discount', this.destinationData.discount.toString());
			if (this.destinationData.image) {
				formData.append('image', this.destinationData.image);
			}

			this.destinationService.saveDestination(formData).subscribe(
				(response: ResponseModel) => {
					this.destinationMessage = response.message;
					if (this.destinationMessage === "Destination created successfully") {
						this.router.navigate(['/Blank']).then(() => {
							setTimeout(() => {
								this.router.navigate(['/Admin']);
							}, 2500);
						});
					}
				},
				(error) => {
					console.error('Creation failed:', error);
				}
			);
		} else {
			console.log('Invalid form');
		}
	}

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.processFile(file);
	}

	processFile(file: File) {
		const reader = new FileReader();
		reader.onload = () => {
			this.imageUrl = reader.result;
			this.destinationData.image = file;
		};
		reader.readAsDataURL(file);
	}
}
