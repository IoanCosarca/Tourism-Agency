import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DestinationModel } from '../model/destination.model';
import { ResponseModel } from '../model/response.model';
import { UpdateDestinationModel } from '../model/update-destination.model';

import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DestinationService {
	constructor(private httpClient: HttpClient) { }

	public getDestinations(): Observable<DestinationModel[]> {
		return this.httpClient.get<DestinationModel[]>(`http://localhost:8000/destination/`);
	}

	public searchDestinationByName(name: string): Observable<DestinationModel[]> {
		return this.httpClient.get<DestinationModel[]>(`http://localhost:8000/destination/get_destination_by_name/${name}` + `/`);
	}

	public searchDestinationByLocation(location: string): Observable<DestinationModel[]> {
		return this.httpClient.get<DestinationModel[]>(`http://localhost:8000/destination/get_destination_by_location/${location}` + `/`);
	}

	public saveDestination(destinationData: FormData): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`http://localhost:8000/destination/create/`, destinationData);
	}

	public updateDestination(destinationName: string, destinationData: UpdateDestinationModel): Observable<ResponseModel> {
		return this.httpClient.put<ResponseModel>(`http://localhost:8000/destination/` + destinationName + `/update/`, destinationData);
	}

	public deleteDestinationByName(name: string): Observable<ResponseModel> {
		return this.httpClient.delete<ResponseModel>(`http://localhost:8000/destination/delete_destination_by_name/${name}/`);
	}
}
