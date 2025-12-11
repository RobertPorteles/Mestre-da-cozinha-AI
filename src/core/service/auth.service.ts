import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to hold current user state
  private _currentUser = signal<Usuario | null>(null);

  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => !!this._currentUser());

  constructor(private router: Router) {}

  login(email: string, senha: string): boolean {
    // Simulating backend authentication
    if (email && senha) {
      const mockUser: Usuario = {
        id: '123',
        nome: 'Chef Usuário',
        email: email,
        senha: '***',
        dataCriacao: new Date(),
        googleId: ''
      };
      this._currentUser.set(mockUser);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
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
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }
}