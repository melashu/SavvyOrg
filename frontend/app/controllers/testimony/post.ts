/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { testimonialApi } from 'frontend/redux/testimonial-api';
import ReduxStoreService from 'frontend/services/redux-store';
import RouterService from '@ember/routing/router-service';
import toastr from 'toastr';

export default class TestimonyPostController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @service router!: RouterService; // Inject Ember Router Service

  @action
  async createTestimonial(event: Event) {
    event.preventDefault();
    // Fetch form inputs
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const testimony = (document.getElementById('testimony') as HTMLInputElement).value;


    // Validate inputs
    if (!name || !role || !testimony) {
      toastr.warning('Please fill in all fields: name, email, and password!', 'Warning');
      return;
    }
    try {
      // Dispatch the register mutation using Redux store
      const response = await this.reduxStore.store.dispatch(
        testimonialApi.endpoints.createTestimony.initiate({ name, role, testimony })
      );

      const testimonyData = response.data;

      // Handle success
      if (testimonyData.message === 'Testimony created successfully') {
        toastr.success('Testimony created successfully');
      } else {
        toastr.error('Testimony creation failed. Please check your details.', 'Error');
        console.error('Testimony creation error:', response.error);
      }
    } catch (error) {
      toastr.error('An unexpected error occurred during testimony creation.', 'Error');
      console.error('Testimony creation error:', error);
    }
  }
}

