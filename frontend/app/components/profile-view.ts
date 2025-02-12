/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { userProfileApi } from '../redux/user-profile-api';
import ReduxStoreService from 'frontend/services/redux-store';
import config from 'frontend/utils/config';

const BASE_URL = config();

interface UserData {
  fullName: string;
  email: string;
  bio: string;
  role: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  profilePicture: string | null;
}

export default class ProfileDisplayPageComponent extends Component {
  @service store: any;
  @service reduxStore!: ReduxStoreService;
  @tracked userData: UserData | null = null;
  @tracked loading: boolean = true;

  private accessId: string | null = localStorage.getItem('accessId');

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.fetchUserData();
  }

  @action
  async fetchUserData() {
    try {
      const response = await this.reduxStore.store.dispatch(
              userProfileApi.endpoints.fetchUserProfile.initiate(this.accessId)
            );
      const data = response.data;

console.log("profile view data");
console.log(data);
console.log("profile view data");

      this.userData = {
        fullName: data.name,
        email: data.email,
        bio: data.bio,
        role: data.role,
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
        },
        profilePicture: data.profilePic 
        ? `${BASE_URL}/${String(data.profilePic).replace(/\\/g, '/')}` 
        : null,
      };

      console.log("user profile: ", this.userData);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      this.loading = false;
    }
  }
}
