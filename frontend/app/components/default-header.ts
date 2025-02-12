/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type GlobalMethodsService from 'frontend/services/global-methods';

export default class HeaderComponent extends Component {
 @service('global-methods') declare globalMethods: GlobalMethodsService;

  @tracked theme: string = 'light';
  @tracked isDrawerOpen: boolean = false;
  @tracked isModalOpen: boolean = false;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    // On initialization, retrieve the saved theme from localStorage
      console.log("GlobalMethods Service:", this.globalMethods);
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.theme = savedTheme;
    this.applyTheme(savedTheme);
  }

  @action
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    localStorage.setItem('theme', this.theme);
  }
 @action
 toggleContactModal(): void {
  console.log("Calling toggleModalContact from HeaderComponent");
  this.globalMethods.toggleModalContact();
 }
  @action
  toggleModal(): void {
    this.isDrawerOpen = false;
        this.isModalOpen = !this.isModalOpen;
    console.log('Modal state:', this.isModalOpen); // Debugging
  }

  @action
  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }




  private applyTheme(theme: string): void {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
