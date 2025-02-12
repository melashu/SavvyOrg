/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import SessionService from 'frontend/services/session';

export default class AdminProfileViewRoute extends Route {
          @service session!: SessionService;
          @service router!: RouterService; // Inject the router service
        
          beforeModel(transition: any) {
            // Check the role using the session service
            console.log("role", this.session.getRole());
        
            if (this.session.getRole() !== 'admin') {
              // Redirect to the "login" route
              this.router.transitionTo('login'); // Use `this.router.transitionTo` instead of `this.transitionTo`
            }
          }
}
