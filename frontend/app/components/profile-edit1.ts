/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import RouterService from '@ember/routing/router-service';
import { userProfileApi } from '../redux/user-profile-api';
import ReduxStoreService from 'frontend/services/redux-store';

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

    // Prepare the text data for the profile update
    const textData = {
      name: this.form.fullName,
      email: this.form.email,
      bio: this.form.bio,
      socialLinks: this.form.socialLinks,
    };

    console.log('social links');
    console.log(this.form.socialLinks);
    console.log(this.form.socialLinks.facebook);
    console.log(this.form.socialLinks.linkedin);
    console.log(this.form.socialLinks.twitter);
    console.log('social links');

    // Prepare the FormData object for profile image and text data
    const formData = new FormData();

    // Append text data to FormData
    formData.append('name', textData.name);
    formData.append('email', textData.email);
    formData.append('bio', textData.bio);
    formData.append('socialLinks', JSON.stringify(textData.socialLinks));

    // Append the profile image if available
    if (this.form.profilePicture) {
      formData.append('profilePicture', this.form.profilePicture);
    }

    console.log('profile edit data', formData);

    // Dispatch the API request with the form data (both text and image)
    await this.reduxStore.store.dispatch(
      userProfileApi.endpoints.updateUserProfile.initiate({ accessId, formData, token })
    );

    console.log('Profile updated successfully.');
  } catch (error) {
    console.error('Error updating profile:', error);
  }
}
}
