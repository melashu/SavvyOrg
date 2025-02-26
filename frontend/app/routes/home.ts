/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HomeRoute extends Route {
  @service headData: any;

  beforeModel() {
    this.setSEO();
  }

  @action
  setSEO() {
    this.headData.title = 'Savvy Bridge - Your Partner in Strategy, Design, and Development';
    this.headData.description = 'Savvy Bridge specializes in bringing digital products to success through expert strategy, design, product management, and development.';
    this.headData.keywords = 'strategy, design, product management, development, digital products, tech consulting';
    this.headData.image = '/images/blog1.jpg';
  }
}