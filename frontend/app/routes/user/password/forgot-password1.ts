/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// app/routes/user/password/forgot-password.ts
import Route from "@ember/routing/route";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { forgetPasswordApi } from '../../../redux/user/password/forgot-password-api';
import ReduxStoreService from 'frontend/services/redux-store';

export default class UserPasswordForgetPasswordRoute extends Route {
  @service reduxStore!: ReduxStoreService;
  @tracked email = "";
  @tracked successMessage: string | null = null;
  @tracked errorMessage: string | null = null;

  @action
  async handleSubmit(event: Event) {
    event.preventDefault();
    try {
console.log("Forgot Password Email");
console.log(this.email);
console.log("Forgot Password Email");

      const response = await this.reduxStore.store.dispatch(
        forgetPasswordApi.endpoints.resetPassword.initiate({ email: this.email })
      ).unwrap();
      this.successMessage = response.message;
      this.errorMessage = null;
    } catch (error: any) {
      this.errorMessage = error?.data?.message || "An unexpected error occurred.";
      this.successMessage = null;
    }
  }
}
