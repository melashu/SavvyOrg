/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HomeController extends Controller {
  @service('global-methods') globalMethods: any;
}
