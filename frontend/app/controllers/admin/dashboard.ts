/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import UrlManagerService from 'frontend/services/url-manager';
export default class AdminDashboardController extends Controller {
      @service urlManager!: UrlManagerService;
  get fullURL(): string {
        console.log("routes in controller");
        console.log(this.urlManager.currentURL);
        console.log("routes in controller");
    return this.urlManager.currentURL; // Access the current URL
  }
}
