import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationModel } from '../model/authentication.model';
import { ResponseModel } from '../model/response.model';
import { UserModel } from '../model/user.model';
import { UserRegisterModel } from '../model/user-register.model';

import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private httpClient: HttpClient) { }

	public getUser(userID: number): Observable<UserModel> {
		return this.httpClient.get<UserModel>(`http://localhost:8000/user/${userID}` + `/`);
	}

	public saveUser(userData: UserRegisterModel): Observable<ResponseModel> {
		return this.httpClient.post<ResponseModel>(`http://localhost:8000/user/create/`, userData);
	}

	public authenticate(userData: AuthenticationModel): Observable<UserModel> {
		return this.httpClient.post<UserModel>(`http://localhost:8000/user/authenticate/`, userData);
	}
}
