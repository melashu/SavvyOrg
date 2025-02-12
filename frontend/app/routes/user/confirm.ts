/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';

export default class UserConfirmRoute extends Route {
  model(params: { token: string }) {
    console.log('Model Token:', params.token); // Check token value
    return params.token;
  }

  setupController(controller: any, model: string, transition: any) {
    super.setupController(controller, model, transition);
    controller.set('model', model); // Explicitly set the model on the controller
  }
}
