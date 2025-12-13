import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to hold current user state
  private _currentUser = signal<Usuario | null>(null);

  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => !!this._currentUser());

  constructor(private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, senha: string) {
    const url = 'http://localhost:8080/api/v1/auth/login'

    const req = {
      email: email,
      senha: senha
  }

    this.http.post(`${url}`,req)
    .subscribe({
      next: (resp : any) => {

        sessionStorage.setItem('token',resp.token);

        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        console.log(e.error.message)
      }
    })
  }

  register(nome: string, email: string, senha: string): boolean {
    // Simulating backend registration
    const newUser: Usuario = {
      id: crypto.randomUUID(),
      nome: nome,
      email: email,
      senha: senha,
      dataCriacao: new Date(),
      googleId: ''
    };
    this._currentUser.set(newUser);
    this.router.navigate(['/dashboard']);
    return true;
  }

  logout() {
    if(confirm('Deseja sair da sessão?')){
      sessionStorage.removeItem('token')
      this.router.navigate(['/login']);
    }
  }
}