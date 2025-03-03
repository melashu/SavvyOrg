/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {


  @service headData: any;

  beforeModel() {
    this.headData.title = "My SEO Optimized Ember App";
    this.headData.description = "An Ember.js app fully optimized for SEO.";
    this.headData.image = "https://example.com/my-image.jpg";
    this.headData.url = "https://example.com";
  }
}
