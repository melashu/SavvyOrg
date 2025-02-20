import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TestimonyPostRoute extends Route {
  @tracked name = '';
  @tracked role = '';
  @tracked testimony = '';

  // Define a type-safe update handler
  @action
  updateProperty(property: keyof this, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    (this[property] as string) = value; // Safely update the property
  }

  @action
  createTestimonial(event: Event): void {
    event.preventDefault();
    console.log('Creating:', {
      fullName: this.name,
      email: this.role,
      password: this.testimony,
    });
    // Add your testimony creation logic here
  }
}
