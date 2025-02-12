/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class DashboardController extends Controller {
      @service router!: any; // Inject the Ember Router service
    
      get currentRouteName() {
    
        console.log("routes in controller");
        console.log(this.router.currentRouteName);
        console.log("routes in controller");
    
        return this.router.currentRouteName; // Access the current route name
      }
}
