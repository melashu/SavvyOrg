/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class HeaderComponent extends Component {
  @service router!: RouterService;

  get isBlogsRoute(): boolean {
    return this.router.currentRouteName.includes('blogs');
  }

  get showHeaderAndFooter(): boolean {
    const excludedRoutes = ['login', 'register', 'dashboard', 'admin', 'author', 'customer', 'user'];
      return !excludedRoutes.some(route => this.router.currentRouteName.includes(route)) || 
           this.router.currentRouteName.includes('authors');
  }
}
