/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { authApi } from '../redux/auth-api';
import ReduxStoreService from 'frontend/services/redux-store';
import RouterService from '@ember/routing/router-service';

export default class RegisterController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @service router!: RouterService; // Inject Ember Router Service

  @action
  async handleRegister(event: Event) {
    event.preventDefault();
    // Fetch form inputs
    const name = (document.getElementById('fullName') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // Validate inputs
    if (!name || !email || !password) {
      alert('Please fill in all fields: name, email, and password!');
      return;
    }

    try {
      // Dispatch the register mutation using Redux store
      const result = await this.reduxStore.store.dispatch(
        authApi.endpoints.register.initiate({ name, email, password })
      );
      const userData = result.data;

      // Handle success
      if (userData.message === 'User registered successfully') {
        alert('Registration successful! Redirecting...');
      } else {
        alert('Registration failed. Please check your details.');
        console.error('Registration error:', result.error);
      }
    } catch (error) {
      alert('An unexpected error occurred during registration.');
      console.error('Registration error:', error);
    }
  }
}
