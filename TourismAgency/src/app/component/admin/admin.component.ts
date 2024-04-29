import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AddDestinationComponent } from "../add-destination/add-destination.component";
import { EditDestinationComponent } from "../edit-destination/edit-destination.component";

@Component({
	selector: 'app-admin',
	standalone: true,
	imports: [CommonModule, MatButtonModule, AddDestinationComponent, EditDestinationComponent],
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.css'
})
export class AdminComponent {
	page!: number;

	ngOnInit(): void {
		this.page = 0;
	}

	toggleDestinations() {
		this.page = 0;
	}

	toggleAddDestination() {
		this.page = 1;
	}
}
