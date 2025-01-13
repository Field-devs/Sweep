import { Observable } from '@nativescript/core';
import { DatabaseService } from '../../services/database.service';

export class LoginViewModel extends Observable {
  private database: DatabaseService;
  public email: string = '';
  public password: string = '';
  public isLoading: boolean = false;

  constructor() {
    super();
    this.database = new DatabaseService();
    this.database.init();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    this.set('isLoading', true);
    try {
      const user = await this.database.getUser(this.email);
      if (user) {
        // Navigate to routes list
        // Frame.topmost().navigate({ moduleName: 'pages/routes/routes-page' });
      } else {
        alert('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login');
    } finally {
      this.set('isLoading', false);
    }
  }

  onRegister() {
    // Frame.topmost().navigate({ moduleName: 'pages/register/register-page' });
  }
}