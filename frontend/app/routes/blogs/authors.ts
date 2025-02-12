/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// app/routes/blogs/authors.ts
import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import config from 'frontend/utils/config';

const BASE_URL = config();


export default class AuthorsPageRoute extends Route {
  @tracked userData = [];
  @tracked page = 1;
  @tracked totalPages = 1;
  @tracked profilePicture = '';

  async model() {
    await this.fetchUserData();
    return { userData: this.userData, page: this.page, totalPages: this.totalPages };
  }

  async fetchUserData() {
    const token = localStorage.getItem('accessToken');
    try {
      // Fetch data from the API
const response = await axios.get(`${BASE_URL}/api/users/authors?pageNumber=${this.page}`, {
  headers: { Authorization: `Bearer ${token}` },
});
    this.userData = response.data.users.map((user: any) => ({
      ...user,
      profilePicture: user.profilePic ? `${BASE_URL}/${String(user.profilePic).replace(/\\/g, '/')}` : '',
    }));
      this.totalPages = response.data.pages;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  @action
  handlePageChange(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.fetchUserData();
    }
  }
}
