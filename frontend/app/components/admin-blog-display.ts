/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import AuthService from '../services/auth';

export default class AdminBlogDisplay extends Component {
  @service auth!: AuthService;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.checkAuthorization();
  }

  async checkAuthorization() {
    const role = await this.auth.fetchUserRole();
    if (role !== 'admin') {
      this.auth.router.transitionTo('unauthorized');
    }
  }
}
