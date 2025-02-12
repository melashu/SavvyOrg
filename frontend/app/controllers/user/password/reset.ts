/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ReduxStoreService from 'frontend/services/redux-store';
import { resetApi } from '../../../redux/user/password/reset-api';

export default class UserPasswordResetController extends Controller {
  @service router!: { currentRoute: { queryParams: { token: any } } };
  @service reduxStore!: ReduxStoreService;

  @tracked password = '';
  @tracked confirmPassword = '';
  @tracked success = false;
  @tracked error: string | null = null;

  private _token: string | null = null;

  set model(value: string) {
    if (value) {
      console.log('Model updated:', value);
      this._token = value; // Store the token for use in handleSubmit
    }
  }

  @action
  async handleSubmit(event: Event) {
    event.preventDefault();

    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (!this._token) {
      this.error = 'Token is missing or invalid';
      return;
    }

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      await this.reduxStore.store.dispatch(
        resetApi.endpoints.resetPassword.initiate({ token: this._token, password: password })
      );
      this.success = true;
      this.error = null; // Clear previous errors
    } catch (err: any) {
      this.error = err.message || 'An error occurred during password reset';
    }
  }
}
