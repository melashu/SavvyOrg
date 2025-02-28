/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { authApi } from '../redux/auth-api';
import ReduxStoreService from 'frontend/services/redux-store';
import RouterService from '@ember/routing/router-service';
import toastr from 'toastr';

export default class RegisterController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @service router!: RouterService; // Inject Ember Router Service

  isSubmitting = false;

  @action
  async handleRegister(event: Event) {
    event.preventDefault();
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (registerButton) registerButton.disabled = true;

    // Fetch form inputs
    const nameInput = document.getElementById('fullName') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous toasts before showing a new one
    toastr.clear();

    // Validate inputs
    if (!name || !email || !password) {
      toastr.warning('Please fill in all fields: name, email, and password!', 'Warning');
      this.isSubmitting = false;
      if (registerButton) registerButton.disabled = false;
      return;
    }

    try {
      // Dispatch the register mutation using Redux store
      const result = await this.reduxStore.store.dispatch(
        authApi.endpoints.register.initiate({ name, email, password })
      );

      toastr.clear(); // Ensure no duplicate messages

      // Handle success response
      if (result?.data) {
        switch (result.data.message) {
          case 'User registered successfully':
            toastr.success('Registration successful! Please check your email');
            nameInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';
            break;
          case 'email_registered':
            toastr.error('This email is already registered.');
            break;
          default:
            toastr.error('Registration error, please check your details.');
        }
      } 
      
      // Handle failure response
      else if (result?.error) {
        toastr.error('An error occurred. Please try again.', 'Error');
        console.error('Registration error:', result.error);
      }
    } catch (error) {
      toastr.error('An unexpected error occurred during registration.', 'Error');
      console.error('Registration error:', error);
    } finally {
      this.isSubmitting = false;
      if (registerButton) registerButton.disabled = false;
    }
  }
}
