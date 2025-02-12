/* eslint-disable prettier/prettier */
import { action } from '@ember/object';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class GlobalMethodsService extends Service {
    @tracked isModalOpen: boolean = false;
   @action
    toggleModalContact(): void {
      this.isModalOpen = !this.isModalOpen;
    }
}
// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:global-methods')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('global-methods') declare altName: GlobalMethodsService;`.
declare module '@ember/service' {
  interface Registry {
    'global-methods': GlobalMethodsService;
  }
}
