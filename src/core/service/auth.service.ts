import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to hold current user state

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
        sessionStorage.setItem('nome', resp.nome);

        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        console.log(e.error.message)
      }
    })
  }

  register(nome: string, email: string, senha: string) {
      const url = 'http://localhost:8080/api/v1/auth/cadastrar'

      const req = {
        nome: nome,
        email: email,
        senha: senha
      }

      this.http.post(`${url}`, req)
      .subscribe({
        next: () => {
          this.router.navigate(['/login'])
        },
        error: (e) => {
          if(e.error.text === 'Cadastro concluído com sucesso!') {
            this.router.navigate(['/login'])
          }
        }
      })

  }

  logout() {
    if(confirm('Deseja sair da sessão?')){
      sessionStorage.removeItem('token')
      this.router.navigate(['/login']);
    }
  }
}