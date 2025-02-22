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
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const companyInput = document.getElementById('company') as HTMLInputElement;
    const roleInput = document.getElementById('role') as HTMLInputElement;
    const testimonyInput = document.getElementById('testimony') as HTMLInputElement;

    const name = nameInput.value;
    const company = companyInput.value;
    const role = roleInput.value;
    const testimony = testimonyInput.value;

    // Validate inputs
    if (!name || !company || !role || !testimony) {
      toastr.warning('Please fill in all fields: name, company, role, and testimony!', 'Warning');
      return;
    }

    try {
      // Dispatch the createTestimony mutation using Redux store
      const response = await this.reduxStore.store.dispatch(
        testimonialApi.endpoints.createTestimony.initiate({ name, company, role, testimony })
      );

      const testimonyData = response.data;

      // Handle success
      if (testimonyData.message === 'Testimony created successfully') {
        toastr.success('Testimony created successfully');

        // Clear input fields after success
        nameInput.value = '';
        companyInput.value = '';
        roleInput.value = '';
        testimonyInput.value = '';
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
