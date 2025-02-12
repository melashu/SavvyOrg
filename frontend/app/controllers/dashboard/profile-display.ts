/* eslint-disable prefer-rest-params */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';

interface UserData {
  fullName: string;
  email: string;
  bio: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  profilePicture: string | null;
}

export default class DashboardProfileDisplayController extends Controller {
  @tracked userData: UserData | null = null;
  @tracked loading = true;

  constructor() {
    super(...arguments);
    this.fetchUserData();
  }

  @action
  async fetchUserData() {
    const accessId = localStorage.getItem('accessId');
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
        params: { accessId },
      });

      const data = response.data;

      this.userData = {
        fullName: data.name,
        email: data.email,
        bio: data.bio,
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
        },
        profilePicture: data.profilePicture,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      this.loading = false;
    }
  }
}
