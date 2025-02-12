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

  @action
  async handleRegister(event: Event) {
    event.preventDefault();
    // Fetch form inputs
    const name = (document.getElementById('fullName') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // Validate inputs
    if (!name || !email || !password) {
      toastr.warning('Please fill in all fields: name, email, and password!', 'Warning');
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
        toastr.success('Registration successful! Please check your email');
      } else {
        toastr.error('Registration failed. Please check your details.', 'Error');
        console.error('Registration error:', result.error);
      }
    } catch (error) {
      toastr.error('An unexpected error occurred during registration.', 'Error');
      console.error('Registration error:', error);
    }
  }
}
