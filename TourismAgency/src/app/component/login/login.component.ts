import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthenticationModel } from '../../model/authentication.model';
import { UserModel } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	loginForm!: FormGroup;

	loginData: AuthenticationModel = {
		email: '',
		password: ''
	}

	userData!: UserModel;

	hide = true;

	loginFailed: boolean = false;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	get email() {
		return this.loginForm.get('email');
	}

	get password() {
		return this.loginForm.get('password');
	}

	login() {
		if (this.loginForm.valid) {
			this.loginData.email = this.loginForm.value.email;
			this.loginData.password = this.loginForm.value.password;

			this.userService.authenticate(this.loginData).subscribe(
				(response: UserModel) => {
					this.userData = response;
					console.log('Login successful');

					// Save user data to sessionStorage
					sessionStorage.setItem('currentUser', JSON.stringify(this.userData));

					// Retrieve geolocation
					this.retrieveGeolocation();

					this.router.navigate(['/']);
				},
				(error) => {
					console.error('Login failed:', error);
					this.loginFailed = true;
				}
			);
		}
	}

	retrieveGeolocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const location = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
					// Save location to sessionStorage
					sessionStorage.setItem('userLocation', JSON.stringify(location));
				},
				error => {
					console.error('Error retrieving geolocation:', error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}

	redirectToRegister() {
		this.router.navigate(['/Register']);
	}
}
