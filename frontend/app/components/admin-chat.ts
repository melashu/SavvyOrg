/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// app/components/admin-chat.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import config from 'frontend/utils/config';

const BASE_URL = config();

interface Message {
  senderEmail: string;
  receiverEmail: string;
  text: string;
  timestamp?: Date;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const socket: Socket = io(`${BASE_URL}`, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default class AdminChat extends Component {
  @tracked messages: Message[] = [];
  @tracked text: string = '';
  @tracked users: User[] = [];
  @tracked selectedUser: string = 'Anonymous';
  @tracked selectedUserName: string = 'Anonymous';
  @tracked sender: string = localStorage.getItem('email') || 'Anonymous';

  // Lifecycle method to initialize data and socket listeners
  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.fetchData();

    socket.on('receive-message', (message: Message) => {
      this.messages = [...this.messages, message];
    });
  }

  // Fetch users and messages from the backend
  async fetchData() {
    try {
      const [messagesRes, usersRes] = await Promise.all([
        axios.get<Message[]>(`${BASE_URL}/api/messages`),
        axios.get<{ users: User[] }>(`${BASE_URL}/api/users/chat`),
      ]);

      this.messages = messagesRes.data;
      this.users = usersRes.data.users || [];

      console.log('users for admin chat');
      console.log(this.users);
      console.log('users for admin chat');

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  // Send a message via socket
  @action
  async sendMessage(event: Event) {
    event.preventDefault();
    if (this.text.trim() === '' || this.selectedUser === 'Anonymous') return;

    const message: Message = {
      senderEmail: this.sender,
      receiverEmail: this.selectedUser,
      text: this.text,
    };

console.log("Message for chat");
console.log(message);
console.log("Message for chat");
    try {
      socket.emit('send-message', message);
      this.text = ''; // Clear input after sending
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }

  // Handle user selection
  @action
  selectUser(email: string, name: string) {
    this.selectedUser = email;
    this.selectedUserName = name;
  }

  // Handle input change
  @action
  updateText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  // Get filtered messages for the selected user
  get filteredMessages() {
    return this.messages.filter(
      (msg) =>
        (msg.senderEmail === this.sender && msg.receiverEmail === this.selectedUser) ||
        (msg.senderEmail === this.selectedUser && msg.receiverEmail === this.sender)
    );
  }
}