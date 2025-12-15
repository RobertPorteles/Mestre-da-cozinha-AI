import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 font-sans">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
             <span class="text-3xl">📝</span>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900">Crie sua Conta</h2>
          <p class="mt-2 text-sm text-gray-600">
            Comece a gerar receitas incríveis hoje
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="nome" class="sr-only">Nome Completo</label>
              <input id="nome" name="nome" type="text" required 
                formControlName="nome"
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" 
                placeholder="Nome Completo">
            </div>
            <div>
              <label for="email-address" class="sr-only">Endereço de Email</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required 
                formControlName="email"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" 
                placeholder="Endereço de Email">
            </div>
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input id="password" name="password" type="password" required 
                formControlName="senha"
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm" 
                placeholder="Senha">
            </div>
          </div>

          <div>
            <button type="submit" 
              [disabled]="registerForm.invalid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Cadastrar
            </button>
          </div>

          <div class="text-sm text-center">
            <a routerLink="/login" class="font-medium text-orange-600 hover:text-orange-500">
              Já tem conta? Faça Login
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registerForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    
      const { nome, email, senha } = this.registerForm.value;
      this.authService.register(nome, email, senha);
    
  }
}