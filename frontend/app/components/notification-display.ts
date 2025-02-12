/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { messagesApi } from '../redux/messages-Api';
import ReduxStoreService from 'frontend/services/redux-store';


interface ContactMessage {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default class NotificationDisplayComponent extends Component {
  @tracked messages: ContactMessage[] = [];
  @tracked isLoading = true;
  @tracked error: string | null = null;
  @service store: any;
  @service reduxStore!: ReduxStoreService;

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.fetchMessages();
  }

  @action
  async fetchMessages() {
    try {
    const response = await this.reduxStore.store.dispatch(
      messagesApi.endpoints.getMessages.initiate(undefined));

      this.messages = response.data; // Assuming API returns an array of messages
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      this.error = 'Failed to load messages.';
    } finally {
      this.isLoading = false;
    }
  }
}
