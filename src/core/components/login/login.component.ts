import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 font-sans">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
             <span class="text-3xl">👨‍🍳</span>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">Bem-vindo de volta</h2>
          <p class="mt-2 text-sm text-gray-600">
            Acesse sua conta para criar novas receitas
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Endereço de Email</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required 
                formControlName="email"
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm" 
                placeholder="Endereço de Email">
            </div>
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required 
                formControlName="senha"
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm" 
                placeholder="Senha">
            </div>
          </div>

          @if (errorMessage) {
            <div class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {{ errorMessage }}
            </div>
          }

          <div>
            <button type="submit" 
              [disabled]="loginForm.invalid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Entrar
            </button>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Ou continue com</span>
            </div>
          </div>

          <div>
            <button type="button" (click)="loginWithGoogle()"
              class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </button>
          </div>

          <div class="text-sm text-center">
            <a routerLink="/cadastro" class="font-medium text-orange-600 hover:text-orange-500">
              Não tem uma conta? Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  loginForm: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('',[Validators.required])
  });

  errorMessage = '';

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const {email,senha}  = this.loginForm.value;
      this.authService.login(email, senha);
    }
  }
}