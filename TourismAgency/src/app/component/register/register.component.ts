import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { ResponseModel } from '../../model/response.model';
import { UserRegisterModel } from '../../model/user-register.model';
import { UserService } from '../../service/user.service';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent {
	registerForm!: FormGroup;

	userData: UserRegisterModel = {
		name: '',
		email: '',
		password: ''
	}

	hide = true;

	hideConfirm = true;

	registrationMessage: string = '';

	constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		}, { validators: this.passwordMatchValidator });
	}

	get name() { return this.registerForm.get('name'); }

	get email() { return this.registerForm.get('email'); }

	get password() { return this.registerForm.get('password'); }

	get confirmPassword() { return this.registerForm.get('confirmPassword'); }

	register() {
		console.log('Registering...');
		if (this.registerForm.valid) {
			console.log('Form is valid');
			this.userData.name = this.registerForm.value.name;
			this.userData.email = this.registerForm.value.email;
			this.userData.password = this.registerForm.value.password;

			this.userService.saveUser(this.userData).subscribe(
				(response: ResponseModel) => {
					this.registrationMessage = response.message;
					if (this.registrationMessage === "User registered successfully") {
						this.redirectToLogin();
					}
				},
				(error) => {
					console.error('Registration failed:', error);
				}
			);
		} else {
			console.log('Form is invalid');
		}
	}

	passwordMatchValidator(formGroup: FormGroup) {
		const passwordControl = formGroup.get('password');
		const confirmPasswordControl = formGroup.get('confirmPassword');

		if (passwordControl?.value !== confirmPasswordControl?.value) {
			confirmPasswordControl?.setErrors({ passwordMismatch: true });
		} else {
			confirmPasswordControl?.setErrors(null);
		}
	}

	redirectToLogin() {
		this.router.navigate(['/Login']);
	}
}
