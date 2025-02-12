/* eslint-disable prettier/prettier */
// app/components/contact-us.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

interface ContactUsArgs {
  openModal: boolean;
  onCloseModal: () => void;
}

export default class ContactUsComponent extends Component<ContactUsArgs> {
  @service declare router: RouterService;

  @tracked name = '';
  @tracked email = '';
  @tracked message = '';
  @tracked error: string | null = null;
  @tracked success: string | null = null;

  validateInputs(): boolean {
    if (!this.name.trim()) {
      this.error = 'Name is required.';
      return false;
    }
    if (!this.email.trim()) {
      this.error = 'Email is required.';
      return false;
    }
    if (!this.message.trim()) {
      this.error = 'Message is required.';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return false;
    }
    this.error = null;
    return true;
  }

  @action
  async handleSubmit() {
    if (!this.validateInputs()) return;

    try {
      const response = await fetch('/contact/contact_us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          message: this.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      this.success = 'Your message has been sent successfully!';
      setTimeout(() => (this.success = null), 3000);

      this.args.onCloseModal();
      this.name = '';
      this.email = '';
      this.message = '';
      this.error = null;
    } catch (err) {
      console.error('Error sending message:', err);
      this.error = 'Failed to send message. Please try again later.';
    }
  }

  @action
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.args.onCloseModal();
    }
  }

  @action
  setupKeyListener() {
    if (this.args.openModal) {
      window.addEventListener('keydown', this.handleKeyDown);
    } else {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  willDestroy() {
    super.willDestroy?.();
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
