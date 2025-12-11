import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { EndpointService } from '../../service/endpoint.service';
import { Receita } from '../../models/receita';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-orange-50/30">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm border-b border-orange-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl mr-2">👨‍🍳</span>
              <h1 class="text-xl font-bold text-gray-800 tracking-tight">Mestre da Cozinha <span class="text-orange-600">Home</span></h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600 text-sm hidden sm:block">Olá, {{ authService.currentUser()?.nome }}</span>
              <button (click)="logout()" class="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors">Sair</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Input Section -->
        <div class="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-6 mb-8 border border-orange-100">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">O que tem na sua cozinha hoje?</h2>
            <p class="text-gray-500">Liste os ingredientes disponíveis e deixe a IA criar a mágica.</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400">🥕</span>
              </div>
              <input 
                type="text" 
                [(ngModel)]="promptInput"
                (keyup.enter)="gerarReceita()"
                placeholder="Ex: 2 ovos, meio tomate, cebola e farinha de trigo..." 
                class="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm transition-all"
              />
            </div>
            <button 
              (click)="gerarReceita()" 
              [disabled]="loading() || !promptInput.trim()"
              class="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-orange-200 transition-all transform active:scale-95 flex items-center justify-center min-w-[160px]">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cozinhando...
              } @else {
                <span>✨ Criar Receita</span>
              }
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Recent Recipe Column (Large) -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-800 flex items-center">
                <span class="mr-2 text-2xl">🍽️</span> Resultado
              </h3>
            </div>

            @if (receitaRecente()) {
              <div class="bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden animate-fade-in">
                <!-- Header Receita -->
                <div class="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-white relative overflow-hidden">
                  <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                  <h2 class="text-3xl font-bold relative z-10">{{ receitaRecente()!.titulo }}</h2>
                  <div class="flex flex-wrap gap-4 mt-4 text-orange-50 font-medium relative z-10">
                    <span class="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      ⏱️ {{ receitaRecente()!.tempoPreparo }}
                    </span>
                    <span class="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      🔥 {{ receitaRecente()!.calorias }}
                    </span>
                  </div>
                </div>
                
                <div class="p-8">
                  <div class="grid md:grid-cols-2 gap-8">
                    <!-- Ingredientes -->
                    <div>
                      <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2 border-orange-100">
                        <span class="text-orange-500 mr-2">🛒</span> Ingredientes
                      </h4>
                      <ul class="space-y-2">
                        @for (item of receitaRecente()!.ingredientes; track $index) {
                          <li class="flex items-start text-gray-600 bg-orange-50/50 p-2 rounded-lg text-sm">
                            <span class="h-1.5 w-1.5 mt-2 mr-2.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                            {{ item }}
                          </li>
                        }
                      </ul>
                    </div>

                    <!-- Instruções -->
                    <div>
                      <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2 border-orange-100">
                        <span class="text-orange-500 mr-2">🍳</span> Preparo
                      </h4>
                      <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        @for (passo of receitaRecente()!.instrucoes; track $index) {
                          <div class="flex gap-3">
                            <span class="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 font-bold text-sm rounded-full flex items-center justify-center mt-0.5">
                              {{ $index + 1 }}
                            </span>
                            <p class="text-gray-600 text-sm leading-relaxed">{{ passo }}</p>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                  <span>Gerado via ChefIA</span>
                  <span>{{ receitaRecente()!.dataGeracao | date:'short' }}</span>
                </div>
              </div>
            } @else {
              <div class="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center h-96 flex flex-col items-center justify-center text-gray-400">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span class="text-4xl opacity-50">🥘</span>
                </div>
                <p class="text-lg font-medium text-gray-600">Sua mesa está vazia</p>
                <p class="text-sm mt-2 max-w-xs mx-auto">Digite os ingredientes que você tem sobrando na geladeira e deixe a IA sugerir o jantar.</p>
              </div>
            }
          </div>

          <!-- History Column (Small) -->
          <div class="lg:col-span-1">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="mr-2 text-2xl">📜</span> Histórico
            </h3>
            
            <div class="space-y-3">
              @if (historico().length > 0) {
                @for (receita of historico(); track receita.id) {
                  <div 
                    class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group" 
                    (click)="selecionarReceita(receita)">
                    <h4 class="font-bold text-gray-800 text-sm mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">{{ receita.titulo }}</h4>
                    <p class="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{{ receita.ingredientes.join(', ') }}</p>
                    <div class="flex justify-between items-center text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      <span class="bg-gray-100 px-2 py-0.5 rounded">{{ receita.tempoPreparo }}</span>
                      <span>{{ receita.dataGeracao | date:'dd/MM' }}</span>
                    </div>
                  </div>
                }
              } @else {
                 <div class="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                   <p>Nenhuma receita anterior.</p>
                 </div>
              }
            </div>
          </div>

        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  endpointService = inject(EndpointService);
  
  promptInput = '';
  loading = signal(false);
  receitaRecente = signal<Receita | null>(null);
  historico = signal<Receita[]>([]);

  constructor() {
    // Carregar histórico inicial (mock)
    this.historico.set(this.endpointService.getHistoricoReceitas());
  }

  async gerarReceita() {
    if (!this.promptInput.trim()) return;

    this.loading.set(true);
    try {
      // Aqui simulamos o envio para o servidor Java que chama a IA
      const novaReceita = await this.endpointService.gerarReceitaNoBackend(this.promptInput);
      
      // Atualiza estado
      this.receitaRecente.set(novaReceita);
      this.historico.update(list => [novaReceita, ...list]);
      this.promptInput = ''; // Limpa input
      
    } catch (error) {
      alert('Não foi possível criar a receita no momento. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }

  selecionarReceita(receita: Receita) {
    this.receitaRecente.set(receita);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}