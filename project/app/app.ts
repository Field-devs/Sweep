import { Application } from '@nativescript/core';
import { DatabaseService } from './services/database.service';

// Initialize database
const database = new DatabaseService();
database.init().catch(error => {
  console.error('Database initialization error:', error);
});

Application.run({ moduleName: 'pages/login/login-page' });