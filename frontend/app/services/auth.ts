/* eslint-disable prettier/prettier */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { store } from '../redux/store';
import { userApi } from '../redux/user-api';

export default class AuthService extends Service {
  @service router!: RouterService;

  async fetchUserRole(): Promise<string | null> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.transitionTo('login'); // Redirect to login
      return null;
    }

    try {

            const response = await store.dispatch(
        userApi.endpoints.getUserRole.initiate(accessToken)
      );

      if (response.data) {
        const role  = await response.data.role;
        return role;
      } else {
        throw new Error('Failed to fetch user role');
      }
    } catch (err) {
      console.error(err);
      this.router.transitionTo('unauthorized'); // Redirect to unauthorized
      return null;
    }
  }
}
