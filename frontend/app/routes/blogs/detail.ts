/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable ember/no-controller-access-in-routes */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BlogsDetailRoute extends Route {
  @service router: any;

  async model(params: { id: string }) {
    return params.id;
  }

    setupController(controller: any, model: string, transition: any) {
    super.setupController(controller, model, transition);
    controller.set('model', model); // Explicitly set the model on the controller
  }
}
