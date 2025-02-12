/* eslint-disable prettier/prettier */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class UrlManagerService extends Service {
  @service router!: RouterService;

  get currentURL(): string {
    return this.router.currentURL;
  }

  get currentRouteName(): string {
    return this.router.currentRouteName;
  }
}

// Don't forget to register it in the types
declare module '@ember/service' {
  interface Registry {
    'url-manager': UrlManagerService;
  }
}
