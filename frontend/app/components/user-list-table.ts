/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable ember/no-runloop */
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
import config from 'frontend/utils/config';

const BASE_URL = config();

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
  @tracked totalAdmins: number = 0;
  @tracked totalAuthors: number = 0;
  @tracked totalCustomers: number = 0;
  @tracked role: string | null = null;
  @tracked searchQuery: string = ''; 

  constructor(owner: unknown, args: UserListTableArgs) {
    super(owner, args);
       // Extract the role query parameter on component initialization
    this.role = this.getRoleFromUrl();

    this.fetchUsers(this.currentPage, this.role, this.searchQuery);
  }

    // Method to extract the 'role' query parameter from the URL
  getRoleFromUrl(): string | null {
    const url = new URL(window.location.href); // Get the full current URL
    return url.searchParams.get('role'); // Extract the 'role' parameter
  }

  async fetchUsers(page: number | undefined, role: string | null, searchQuery: string | null) {
    this.loading = true;
    try {
      const response = await this.reduxStore.store.dispatch(
              userManagementApi.endpoints.fetchUsers.initiate({ page, role, searchQuery })
            );
  this.users = response.data.users.map((user: any) => ({
      ...user,
      profilePicture: user.profilePic ? `${BASE_URL}/${String(user.profilePic).replace(/\\/g, '/')}` : '',
    }));
this.totalUsers = response.data.total;
this.currentPage = response.data.page;
this.totalPages = response.data.pages;
this.totalAdmins = response.data.admins;
this.totalAuthors = response.data.authors;
this.totalCustomers = response.data.customers;
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
    this.fetchUsers(1, this.role, searchQuery); // Always reset to page 1 when performing a search
  }



@action
async handleRoleChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const userId = selectElement.dataset['userId'];
  const newRole = selectElement.value;

  const token = localStorage.getItem('accessToken');
  if (!userId) {
    console.error('User ID is missing.');
    return;
  }

  try {
    // Find the user by userId
    const user = this.users.find((user) => user._id === userId);
    if (user) {
      // Make the API call to change the role
      await this.reduxStore.store.dispatch(
        userManagementApi.endpoints.changeUserRole.initiate({
          userId,
          role: newRole,
          token,
        })
      );

      // Update the role in the user list
      const updatedUsers = this.users.map((userItem) => {
        if (userItem._id === userId) {
          return { ...userItem, role: newRole };  // Return a new user object with updated role
        }
        return userItem;
      });

      // Trigger reactivity by assigning a new array
      this.users = updatedUsers;

      console.log(`Role successfully updated to ${newRole} for user: ${user.name}`);
    } else {
      console.error('User not found in the users list.');
    }
  } catch (error) {
    console.error('Error changing role:', error);

    // Rollback on error
    const user = this.users.find((user) => user._id === userId);
    if (user) {
      console.log('Rolling back role change for user:', user);
      user.role = user.role;  // Restore the old role
      this.users = [...this.users];  // Trigger re-render
    }
    alert('Failed to change role. Please try again.');
  }
}

  @action
  async handleArchive(userId: string, userName: string) {
      const token = localStorage.getItem('accessToken');
      const isDeleted = true;
    if (!confirm(`Are you sure you want move ${userName}? to archive`)) {
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
      console.error('Error moving user to archive:', error);
    }
  }

  @action
  handleNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage  + 1;
      this.fetchUsers(this.currentPage, this.role, this.searchQuery);
    }
  }

    @action
  handlePreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage  - 1;
      this.fetchUsers(this.currentPage, this.role, this.searchQuery);
    }
  }
}
