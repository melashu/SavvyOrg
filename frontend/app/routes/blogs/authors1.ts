/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthorsPageRoute extends Route {
  @service store: any;

  model() {
    return {}; // Keep the model simple as logic is now in the controller
  }
}
