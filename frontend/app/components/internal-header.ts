/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// app/components/header.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

interface Message {
  _id: number;
  name: string;
  message: string;
}

export default class InternalHeaderComponent extends Component {
  @tracked theme: 'light' | 'dark' = 'light';
  @tracked messages: Message[] = [];
  
  @service router: any;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.initializeTheme();
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.theme = savedTheme;
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }

  @action toggleDarkMode() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
    localStorage.setItem('theme', this.theme);
  }
}
