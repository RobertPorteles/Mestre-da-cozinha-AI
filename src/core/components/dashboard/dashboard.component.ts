import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { EndpointService } from '../../service/endpoint.service';
import { Receita, ReceitaAPI, ReceitaParsed } from '../../models/receita';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-orange-50/30 flex">
      <!-- Sidebar -->
      <aside class="w-72 bg-white shadow-lg border-r border-orange-100 hidden lg:flex flex-col">
        <div class="p-6 border-b border-orange-100">
          <div class="flex items-center mb-2">
            <span class="text-2xl mr-2">📜</span>
            <h2 class="text-lg font-bold text-gray-800">Minhas Receitas</h2>
          </div>
          <p class="text-xs text-gray-500">Clique para visualizar</p>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          @if (historico().length > 0) {
            @for (receita of historico(); track receita.id) {
              <div 
                class="p-3 rounded-lg hover:bg-orange-50 transition-all cursor-pointer group border border-transparent hover:border-orange-200"
                [class.bg-orange-50]="receitaSelecionada()?.id === receita.id"
                [class.border-orange-300]="receitaSelecionada()?.id === receita.id"
                (click)="selecionarReceita(receita)">
                <h4 class="font-semibold text-gray-800 text-sm mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {{ receita.titulo }}
                </h4>
                <div class="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                  <span class="flex items-center">
                    <span class="mr-1">⏱️</span>
                    {{ receita.tempoPreparo }}
                  </span>
                  <span>{{ receita.dataGeracao | date:'dd/MM/yy' }}</span>
                </div>
              </div>
            }
          } @else {
            <div class="text-center py-12 px-4">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-3xl opacity-50">🍳</span>
              </div>
              <p class="text-sm text-gray-500">Nenhuma receita salva ainda.</p>
              <p class="text-xs text-gray-400 mt-1">Comece criando sua primeira receita!</p>
            </div>
          }
        </div>

        <div class="p-4 border-t border-orange-100 bg-orange-50/50">
          <div class="text-center text-xs text-gray-500">
            <span class="font-semibold text-gray-700">{{ historico().length }}</span> receita(s) salva(s)
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
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

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <!-- Input Section -->
            <div class="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-6 mb-8 border border-orange-100">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">O que tem na sua cozinha hoje?</h2>
                <p class="text-gray-500">Liste os ingredientes disponíveis e deixe a IA criar a mágica.</p>
              </div>
              
              <form [formGroup]="form" (ngSubmit)="gerarReceita()">
                <div class="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                  <div class="flex-1 relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-400">🥕</span>
                    </div>
                    <input 
                      type="text" 
                      formControlName="ingredientes"
                      placeholder="Ex: 2 ovos, meio tomate, cebola e farinha de trigo..." 
                      class="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    [disabled]="loading() || form.invalid"
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
              </form>
            </div>

            <!-- Results Section -->
            @if (receitasGeradas().length > 0) {
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                    <span class="mr-2 text-2xl">🍽️</span> 
                    Receitas Geradas
                    <span class="ml-3 text-sm font-normal text-gray-500">({{ receitasGeradas().length }} opções)</span>
                  </h3>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  @for (receita of receitasGeradas(); track receita.id) {
                    <div class="bg-white rounded-2xl shadow-lg shadow-gray-200 border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                         (click)="visualizarReceita(receita)">
                      <!-- Header Receita -->
                      <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
                        <h2 class="text-xl font-bold relative z-10 line-clamp-2">{{ receita.titulo }}</h2>
                        <div class="flex flex-wrap gap-2 mt-3 text-orange-50 text-xs font-medium relative z-10">
                          <span class="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                            ⏱️ {{ receita.tempoPreparo }}
                          </span>
                          <span class="flex items-center bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                            🔥 {{ receita.calorias }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="p-5">
                        <!-- Preview dos Ingredientes -->
                        <div class="mb-4">
                          <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center">
                            <span class="text-orange-500 mr-1">🛒</span> Ingredientes
                          </h4>
                          <div class="flex flex-wrap gap-1">
                            @for (item of receita.ingredientes.slice(0, 4); track $index) {
                              <span class="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                {{ item }}
                              </span>
                            }
                            @if (receita.ingredientes.length > 4) {
                              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{{ receita.ingredientes.length - 4 }}
                              </span>
                            }
                          </div>
                        </div>

                        <!-- Preview das Instruções -->
                        <div>
                          <h4 class="text-sm font-bold text-gray-800 mb-2 flex items-center">
                            <span class="text-orange-500 mr-1">🍳</span> Modo de Preparo
                          </h4>
                          <p class="text-xs text-gray-600 line-clamp-3">
                            {{ receita.instrucoes[0] }}
                          </p>
                          <button class="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center">
                            Ver receita completa
                            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Recipe Detail Modal/View -->
            @if (receitaSelecionada()) {
              <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-800 flex items-center">
                    <span class="mr-2 text-2xl">📖</span> Receita Detalhada
                  </h3>
                  <button (click)="fecharReceita()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div class="bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden animate-fade-in">
                  <!-- Header Receita -->
                  <div class="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <h2 class="text-3xl font-bold relative z-10">{{ receitaSelecionada()!.titulo }}</h2>
                    <div class="flex flex-wrap gap-4 mt-4 text-orange-50 font-medium relative z-10">
                      <span class="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        ⏱️ {{ receitaSelecionada()!.tempoPreparo }}
                      </span>
                      <span class="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        🔥 {{ receitaSelecionada()!.calorias }}
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
                          @for (item of receitaSelecionada()!.ingredientes; track $index) {
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
                          @for (passo of receitaSelecionada()!.instrucoes; track $index) {
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
                    <span>{{ receitaSelecionada()!.dataGeracao | date:'short' }}</span>
                  </div>
                </div>
              </div>
            }

            <!-- Empty State -->
            @if (receitasGeradas().length === 0 && !receitaSelecionada()) {
              <div class="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center min-h-[400px] flex flex-col items-center justify-center text-gray-400">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <span class="text-4xl opacity-50">🥘</span>
                </div>
                <p class="text-lg font-medium text-gray-600">Sua mesa está vazia</p>
                <p class="text-sm mt-2 max-w-xs mx-auto">Digite os ingredientes que você tem sobrando na geladeira e deixe a IA sugerir o jantar.</p>
              </div>
            }
          </div>
        </main>
      </div>
    </div>

    <style>
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #fef3f0;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #fb923c;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #f97316;
      }

      .animate-fade-in {
        animation: fadeIn 0.5s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    </style>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  endpointService = inject(EndpointService);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  
  loading = signal(false);
  receitasGeradas = signal<ReceitaParsed[]>([]);
  receitaSelecionada = signal<ReceitaParsed | null>(null);
  historico = signal<ReceitaParsed[]>([]);

  form = this.fb.group({
    ingredientes: new FormControl('', [Validators.required])
  });

  // Método para gerar receitas
  gerarReceita() {
    if (this.form.invalid) {
      return;
    }

    const auth = sessionStorage.getItem('token');
    this.loading.set(true);
    const url = 'http://localhost:8081/api/v1/receitas';
    
    const promptInput = this.form.value.ingredientes || '';

    this.http.post<ReceitaAPI>(url, this.form.value, {
      headers: { Authorization: `Bearer ${auth}` }
    }).subscribe({
      next: (response: ReceitaAPI) => {
        console.log('Resposta da API:', response);
        
        // Processa TODAS as receitas
        const receitasParsed = this.endpointService.parseTodasReceitas(response, promptInput);
        
        console.log('Receitas processadas:', receitasParsed);
        
        // Exibe todas as receitas geradas
        this.receitasGeradas.set(receitasParsed);
        
        // Adiciona TODAS as receitas ao histórico
        this.historico.update(hist => [...receitasParsed, ...hist]);
        
        // Limpa o formulário
        this.form.reset();
        
        this.loading.set(false);
      },
      error: (e) => {
        console.error('Erro ao gerar receita:', e);
        this.loading.set(false);
      }
    });
  }

  // Método para visualizar receita completa
  visualizarReceita(receita: ReceitaParsed) {
    this.receitaSelecionada.set(receita);
  }
  
  // Método para selecionar receita da sidebar
  selecionarReceita(receita: ReceitaParsed) {
    this.receitaSelecionada.set(receita);
  }

  // Método para fechar visualização
  fecharReceita() {
    this.receitaSelecionada.set(null);
  }

  logout() {
    this.authService.logout();
  }
}