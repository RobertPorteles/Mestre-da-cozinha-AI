import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Entrar
            </button>
          </div>

          <div class="text-sm text-center">
            <a routerLink="/cadastro" class="font-medium text-emerald-600 hover:text-emerald-500">
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
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(3)]]
  });

  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      const success = this.authService.login(email, senha);
      if (!success) {
        this.errorMessage = 'Credenciais inválidas.';
      }
    }
  }
}