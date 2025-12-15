import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { sign } from 'crypto';

@Component({
  selector: 'app-planos-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="min-h-screen bg-orange-50/30">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm border-b border-orange-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <button (click)="voltarDashboard()" class="mr-4 text-gray-600 hover:text-gray-800 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <span class="text-2xl mr-2">👨‍🍳</span>
              <h1 class="text-xl font-bold text-gray-800 tracking-tight">Mestre da Cozinha <span class="text-orange-600">Premium</span></h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600 text-sm hidden sm:block">Olá, {{nomeUsuario()}}</span>
              <button (click)="logout()" class="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors">Sair</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano ideal para você
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial da culinária com IA e crie receitas ilimitadas
          </p>
        </div>

        <!-- Plans Grid -->
        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <!-- Plano Gratuito -->
          <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transform transition-all hover:scale-105">
            <div class="bg-gray-100 px-8 py-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-2xl font-bold text-gray-800">Plano Gratuito</h3>
                <span class="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">ATUAL</span>
              </div>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-900">R$ 0</span>
                <span class="text-gray-600 ml-2">/mês</span>
              </div>
            </div>

            <div class="p-8">
              <ul class="space-y-4 mb-8">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-700 font-medium">5 receitas por dia</span>
                    <p class="text-xs text-gray-500 mt-1">Gere até 5 receitas personalizadas diariamente</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-700 font-medium">Receitas básicas</span>
                    <p class="text-xs text-gray-500 mt-1">Sugestões simples e práticas para o dia a dia</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-700 font-medium">Histórico de 30 dias</span>
                    <p class="text-xs text-gray-500 mt-1">Acesse suas últimas receitas criadas</p>
                  </div>
                </li>
                <li class="flex items-start opacity-50">
                  <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-400 font-medium line-through">Receitas ilimitadas</span>
                  </div>
                </li>
                <li class="flex items-start opacity-50">
                  <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-400 font-medium line-through">Receitas gourmet</span>
                  </div>
                </li>
                <li class="flex items-start opacity-50">
                  <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-400 font-medium line-through">Suporte prioritário</span>
                  </div>
                </li>
              </ul>

              <button 
                disabled
                class="w-full py-3 px-6 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed">
                Plano Atual
              </button>
            </div>
          </div>

          <!-- Plano Premium -->
          <div class="bg-white rounded-2xl shadow-2xl border-2 border-orange-500 overflow-hidden transform transition-all hover:scale-105 relative">
            <!-- Badge Popular -->
            <div class="absolute top-6 right-6 z-10">
              <span class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                MAIS POPULAR
              </span>
            </div>

            <div class="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <h3 class="text-2xl font-bold mb-2 relative z-10">Plano Premium</h3>
              <div class="flex items-baseline relative z-10">
                <span class="text-4xl font-bold">R$ 29,90</span>
                <span class="text-orange-100 ml-2">/mês</span>
              </div>
              <p class="text-sm text-orange-100 mt-2 relative z-10">Cancele quando quiser</p>
            </div>

            <div class="p-8">
              <ul class="space-y-4 mb-8">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Receitas ilimitadas</span>
                    <p class="text-xs text-gray-500 mt-1">Crie quantas receitas quiser, sem limites diários</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Receitas gourmet e especiais</span>
                    <p class="text-xs text-gray-500 mt-1">Acesso a receitas sofisticadas e de alta gastronomia</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Histórico ilimitado</span>
                    <p class="text-xs text-gray-500 mt-1">Acesse todas as suas receitas criadas, para sempre</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Modo nutricionista</span>
                    <p class="text-xs text-gray-500 mt-1">Informações nutricionais detalhadas em cada receita</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Exportação em PDF</span>
                    <p class="text-xs text-gray-500 mt-1">Baixe suas receitas em formato PDF para imprimir</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <span class="text-gray-800 font-bold">Suporte prioritário</span>
                    <p class="text-xs text-gray-500 mt-1">Atendimento VIP com resposta em até 24h</p>
                  </div>
                </li>
              </ul>

              <button 
                (click)="assinarPremium()"
                class="w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105">
                🔥 Assinar Premium
              </button>

              <p class="text-center text-xs text-gray-500 mt-4">
                Pagamento seguro • Cancele quando quiser
              </p>
            </div>
          </div>

        </div>

        <!-- Benefícios Extras -->
        <div class="mt-16 max-w-4xl mx-auto">
          <h3 class="text-2xl font-bold text-gray-800 text-center mb-8">
            Por que escolher o Premium?
          </h3>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-md border border-orange-100 text-center">
              <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">⚡</span>
              </div>
              <h4 class="font-bold text-gray-800 mb-2">Sem Limites</h4>
              <p class="text-sm text-gray-600">Crie quantas receitas quiser, quando quiser, sem restrições diárias</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-md border border-orange-100 text-center">
              <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">👨‍🍳</span>
              </div>
              <h4 class="font-bold text-gray-800 mb-2">IA Avançada</h4>
              <p class="text-sm text-gray-600">Receitas mais elaboradas, criativas e com técnicas profissionais</p>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-md border border-orange-100 text-center">
              <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">💎</span>
              </div>
              <h4 class="font-bold text-gray-800 mb-2">Economia Real</h4>
              <p class="text-sm text-gray-600">Menos de R$ 1 por dia para revolucionar sua culinária</p>
            </div>
          </div>
        </div>
      </main>
    </div>`,
})
export class PlanosComponent {

  nomeUsuario = signal('')
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    const name = sessionStorage.getItem('nome');

    this.nomeUsuario.set(name)
  }

  voltarDashboard() {
    this.router.navigate(['/dashboard']);
  }

  assinarPremium() {
    console.log('Iniciando processo de assinatura Premium');
    // Implementar lógica de pagamento
  }

  logout() {
    this.authService.logout();
  }
}
