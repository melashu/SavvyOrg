/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ReduxStoreService from 'frontend/services/redux-store';
import { forgetPasswordApi } from '../../../redux/user/password/forgot-password-api';

export default class UserPasswordForgotPasswordController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @tracked successMessage: string | null = null;
  @tracked errorMessage: string | null = null;

  @action
  async handleSubmit(event: Event) {
    event.preventDefault(); // Prevent form submission
    try {
      const email = (document.getElementById('email') as HTMLInputElement).value;

      const response = await this.reduxStore.store.dispatch(
        forgetPasswordApi.endpoints.resetPassword.initiate({ email: email })
      ).unwrap();

      console.log('forgot password response');
      console.log(response);
      console.log('forgot password response');

      this.successMessage = response.message;
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error?.data?.message || 'An unexpected error occurred.';
      this.successMessage = null;
    }
  }
}
