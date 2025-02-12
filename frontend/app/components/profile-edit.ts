/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { userProfileApi } from '../redux/user-profile-api';
import ReduxStoreService from 'frontend/services/redux-store';
import type RouterService from '@ember/routing/router-service';

interface SocialLinks {
  facebook: string;
  linkedin: string;
  twitter: string;
}

interface FormState {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  socialLinks: SocialLinks;
  profilePicture: File | null;
  profilePictureUrl: string | null;
}

export default class ProfileEditComponent extends Component {
  @service store: any;
  @service reduxStore!: ReduxStoreService;
  @service router!: RouterService;
  @tracked form: FormState = {
    id: '12345',
    fullName: '',
    email: '',
    bio: '',
    socialLinks: { 
      facebook: '', 
      linkedin: '', 
      twitter: '' 
    },
    profilePicture: null,
    profilePictureUrl: null,
  };

  @tracked loading: boolean = true;
  @tracked profilePicturePreview: string | null = null; 

  private accessId: string | null = localStorage.getItem('accessId');

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.fetchUserData();
  }

  async fetchUserData() {
    try {
      const response = await this.reduxStore.store.dispatch(
        userProfileApi.endpoints.fetchUserProfile.initiate(this.accessId)
      );

      const data = response.data;

      this.form = {
        ...this.form,
        fullName: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
        },
        profilePictureUrl: data.profilePicture || null,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      this.loading = false;
    }
  }

  @action
  handleChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    if (name in this.form.socialLinks) {
      this.form = {
        ...this.form,
        socialLinks: { ...this.form.socialLinks, [name]: value },
      };
    } else {
      this.form = { ...this.form, [name]: value };
    }
  }

  @action
  handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;

    this.form = { ...this.form, profilePicture: file || null };


    console.log("profile image");
    console.log(file);
    console.log("profile image");

    if (file) {
      this.profilePicturePreview = URL.createObjectURL(file);
    console.log("this.profilePicturePreview");
    console.log(this.profilePicturePreview);
    console.log("this.profilePicturePreview");
    } else {
      this.profilePicturePreview = null;
    }
  }
@action
async handleSubmit(event: Event) {
  event.preventDefault();

  console.log("Submitting profile edit...");

  try {
    const accessId = localStorage.getItem('accessId');
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    // Prepare FormData object
    const formData = new FormData();
    
    // Append basic text fields
    formData.append('name', this.form.fullName);
    formData.append('email', this.form.email);
    formData.append('bio', this.form.bio);

    // Append social links individually as separate fields
    formData.append('facebook', this.form.socialLinks.facebook);
    formData.append('linkedin', this.form.socialLinks.linkedin);
    formData.append('twitter', this.form.socialLinks.twitter);

    // Append profile picture if available
    if (this.form.profilePicture) {
      formData.append('profilePicture', this.form.profilePicture);
    }

    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Dispatch the API request with the form data (both text and image)
    await this.reduxStore.store.dispatch(
      userProfileApi.endpoints.updateUserProfile.initiate({ accessId, formData, token })
    );
    // Correct the route transition
    window.location.href = `/${role}/profile/view`
    console.log("Profile updated successfully.");
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}

}
