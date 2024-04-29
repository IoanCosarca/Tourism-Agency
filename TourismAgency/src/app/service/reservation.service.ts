import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ReservationModel } from '../model/reservation.model';
import { ResponseModel } from '../model/response.model';

import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ReservationService {
	constructor(private httpClient: HttpClient) { }

	public getReservationsByDestination(destinationId: number): Observable<ReservationModel[]> {
		return this.httpClient.get<ReservationModel[]>(`http://localhost:8000/reservation/get_reservations_by_destination/${destinationId}/`);
	}

	public saveReservation(reservationData: ReservationModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`http://localhost:8000/reservation/create/`, reservationData);
	}
}
