import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  loading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = '¡Inicio de sesión correcto!';

        localStorage.setItem('auth_token', response.token);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message ?? 'No se ha podido iniciar sesión.';
      },
    });
  }
}
