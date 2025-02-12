/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BlogNavBarComponent extends Component {
  @tracked theme: 'light' | 'dark' = 'light';

  constructor(owner: unknown, args: Record<string, unknown>) {
    super(owner, args);
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.theme = savedTheme as 'light' | 'dark';
    this.updateTheme(savedTheme);
  }

  @action
  toggleTheme(): void {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.theme = newTheme;
    this.updateTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  private updateTheme(theme: string): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
