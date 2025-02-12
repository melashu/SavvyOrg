/* eslint-disable prettier/prettier */
/* eslint-disable no-self-assign */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { userManagementApi } from '../redux/user-management-api';
import ReduxStoreService from 'frontend/services/redux-store';

interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  role: string;
  isConfirmed: boolean;
  avatar: string;
  profilePic?: string;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

interface UserListTableArgs {
  // Define the arguments the component accepts here, if applicable.
  onPageChange?: (page: number) => void;
}

export default class UserListTableComponent extends Component<UserListTableArgs> {
  @service store: any;
  @service reduxStore!: ReduxStoreService;
  @tracked users: User[] = [];
  @tracked loading: boolean = true;
  @tracked currentPage: number = 1;
  @tracked totalPages: number = 1;
  @tracked totalUsers: number = 0;
  @tracked totalArchivedAdmins: number = 0;
  @tracked totalArchivedAuthors: number = 0;
  @tracked totalArchivedCustomers: number = 0;
  @tracked searchQuery: string = '';

  constructor(owner: unknown, args: UserListTableArgs) {
    super(owner, args);
    this.fetchArchivedUsers(this.currentPage, this.searchQuery);
  }
  async fetchArchivedUsers(page: number | undefined, searchQuery: string | null) {
    this.loading = true;
    try {
      const response = await this.reduxStore.store.dispatch(
              userManagementApi.endpoints.fetchArchivedUsers.initiate({page, searchQuery})
            );
this.users = response.data.archivedUsers;
this.totalUsers = response.data.total;
this.currentPage = response.data.page;
this.totalPages = response.data.pages;
this.totalArchivedAdmins = response.data.archivedAdmins;
this.totalArchivedAuthors = response.data.archivedAuthors;
this.totalArchivedCustomers = response.data.archivedCustomers;

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      this.loading = false;
    }
  }



    @action
  handleSearch(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();

    // Update searchQuery and debounce the search operation
    this.searchQuery = query;
     this.performSearch(this.searchQuery);
  }

  @action
  performSearch(searchQuery: string) {
    this.fetchArchivedUsers(1, searchQuery); // Always reset to page 1 when performing a search
  }



  @action
  async handleUnArchive(userId: string, userName: string) {
      const token = localStorage.getItem('accessToken');
      const isDeleted = false;
    if (!confirm(`Are you sure you want move ${userName}? to un archived`)) {
      return;
    }
    try {
      await this.reduxStore.store.dispatch(
        userManagementApi.endpoints.moveUserToArchive.initiate({
          userId, isDeleted, token
        })
      );
      this.users = this.users.filter((user) => user._id !== userId);
    } catch (error) {
      console.error('Error moving user to un archived:', error);
    }
  }


  @action
  async handleDelete(userId: string, userName: string) {
      const token = localStorage.getItem('accessToken');
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }
    try {
      await this.reduxStore.store.dispatch(
        userManagementApi.endpoints.deleteUser.initiate({
          userId, token
        })
      );
      this.users = this.users.filter((user) => user._id !== userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  @action
  handleNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage  + 1;
      this.fetchArchivedUsers(this.currentPage, this.searchQuery);
    }
  }

    @action
  handlePreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage  - 1;
      this.fetchArchivedUsers(this.currentPage, this.searchQuery);
    }
  }
}
