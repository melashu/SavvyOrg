/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {


   @service headData: any;

  beforeModel() {
    this.headData.title = "Savvy Bridge Software Company";
    this.headData.description = "Savvy Bridge Software Company";
  }
}
