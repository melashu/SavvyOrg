/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import SessionService from 'frontend/services/session';
export default class CustomerChatRoute extends Route {
                                      @service session!: SessionService;
                                      @service router!: RouterService; // Inject the router service
                                    
                                      beforeModel(transition: any) {
                                        // Check the role using the session service
                                        console.log("role", this.session.getRole());
                                    
                                        if (this.session.getRole() !== 'customer') {
                                          // Redirect to the "login" route
                                          this.router.transitionTo('login'); // Use `this.router.transitionTo` instead of `this.transitionTo`
                                        }
                                      }
}
