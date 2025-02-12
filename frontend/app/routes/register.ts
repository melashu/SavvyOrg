import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RegisterRoute extends Route {
  @tracked fullName = '';
  @tracked email = '';
  @tracked password = '';

  // Define a type-safe update handler
  @action
  updateProperty(property: keyof this, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    (this[property] as string) = value; // Safely update the property
  }

  @action
  handleRegister(event: Event): void {
    event.preventDefault();
    console.log('Registering:', {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    });
    // Add your registration logic here
  }
}
