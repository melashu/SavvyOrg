/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { authApi } from '../redux/auth-api';
import ReduxStoreService from 'frontend/services/redux-store';
import RoleService from 'frontend/services/role';
import SessionService from 'frontend/services/session';
import RouterService from '@ember/routing/router-service';
import toastr from 'toastr';

export default class LoginController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @service('role') declare roleService: RoleService;
  @service router!: RouterService;
  @service session!: SessionService;

  @action
  async handleLogin(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (!email || !password) {
      toastr.warning('Please fill in both email and password!', 'Warning');
      return;
    }

    try {
      // Dispatch the login mutation using Redux store
      const result = await this.reduxStore.store.dispatch(
        authApi.endpoints.login.initiate({ email, password })
      );

      if ('error' in result && result.error) {
        const error = result.error;

        // Type narrowing for FetchBaseQueryError
        if ('status' in error) {
          if (error.status === 401) {
            toastr.error('Login failed. Entered incorrect email or password.', 'Error');
          } else {
            toastr.error('An unexpected error occurred.', 'Error');
            console.error('Login error:', error);
          }
        } else {
          // Handle other types of errors (SerializedError)
          toastr.error('An unexpected error occurred.', 'Error');
          console.error('Login error:', error);
        }
      } else if ('data' in result && result.data) {
        const userData = result.data;
        if (userData.accessToken && userData.accessToken !== '') {
          this.assignUserRole(userData.role);
          this.session.setRole(userData.role);
          toastr.success('Login successful!', 'Welcome to your Dashboard');
          localStorage.setItem('accessToken', userData.accessToken);
          localStorage.setItem('accessId', userData.encryptedPackage);
          localStorage.setItem('userId', userData.id);
          localStorage.setItem('role', userData.role);
          localStorage.setItem('email', userData.email);
          localStorage.setItem('author', userData.role);

          const url = userData.url;
          const formattedUrl = url.startsWith('/') ? url.slice(1) : url;
          const routeName = formattedUrl.replace(/\//g, '.');
          this.router.transitionTo(routeName);
        } else {
          toastr.error('Login failed. Please check your credentials.', 'Error');
        }
      } else {
        toastr.error('An unexpected error occurred.', 'Error');
        console.error('Unexpected result:', result);
      }
    } catch (error) {
      toastr.error('An unexpected error occurred.', 'Error');
      console.error('Login error:', error);
    }
  }

  assignUserRole(role: string) {
    this.roleService.assignRole(role);
    console.log('User Role Assigned');
  }
}
