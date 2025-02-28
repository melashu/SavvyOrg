/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import config from 'frontend/utils/config';

const BASE_URL = config();

export default class BlogsAuthorsController extends Controller {
  @tracked userData: any[] = [];
  @tracked page = 1;
  @tracked totalPages = 1;
  @tracked profilePicture = '';
  @tracked isLoading = true;
  @tracked errorMessage: string | null = null;

  constructor() {
    super();
    this.fetchUserData(); // Load data when the controller is instantiated
  }

  async fetchUserData() {
    this.isLoading = true;
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/authors?pageNumber=${this.page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log('authors response data');
      console.log(response.data);
      console.log('authors response data');

      this.userData = response.data.users.map((user: any) => ({
        ...user,
        profilePicture: user.profilePic
          ? `${BASE_URL}/${String(user.profilePic).replace(/\\/g, '/')}`
          : '',
      }));
      this.totalPages = response.data.pages;
      this.errorMessage = null;
    } catch (err) {
      console.error('Error fetching authors:', err);
      this.errorMessage = 'Failed to load authors.';
    } finally {
      this.isLoading = false;
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
