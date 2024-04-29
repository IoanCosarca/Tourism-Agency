import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import * as L from 'leaflet';

@Component({
	selector: 'app-contact',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './contact.component.html',
	styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

	ngOnInit(): void {
		this.initMap();
	}

	private initMap(): void {
		const map = L.map('map').setView([46.7712, 23.6236], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker([46.7712, 23.6236]).addTo(map)
			.bindPopup('Expedition Hub<br>Cluj-Napoca, Romania')
			.openPopup();
	}
}
