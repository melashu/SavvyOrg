/* eslint-disable ember/classic-decorator-hooks */
/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { userConfirmApi } from '../../redux/user/confirm-api';
import ReduxStoreService from 'frontend/services/redux-store';

export default class UserConfirmController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @tracked isVerified = false;
  @tracked error: string | null = null;

  // Observe the model change
  set model(value: string) {
    if (value) {
      console.log('Model updated:', value);
      this.verifyEmail(value);
    }
  }

  @action
  async verifyEmail(token: string) {
    console.log('Verifying email with token:', token);
    try {
      const response = await this.reduxStore.store.dispatch(
        userConfirmApi.endpoints.confirmEmail.initiate(token)
      );

      if (response?.data) {
        this.isVerified = true;
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      this.error = 'An unexpected error occurred. Please try again later.';
    }
  }
}
