/* eslint-disable ember/no-side-effects */
/* eslint-disable prettier/prettier */
// app/components/sidebar.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RoleService from 'frontend/services/role';
import type RouterService from '@ember/routing/router-service';

interface MenuItem {
  title: string;
  link?: string; // Make the link property optional
  icon: string;
  subItems?: Array<{ title: string; link: string }>;
}


export default class SidebarComponent extends Component {
  @service('role') declare roleService: RoleService;
  @tracked isSidebarOpen = true;
  @tracked activeMenu: string | null = null;
  @tracked selectedRole!: string;
  @service('router') declare router: RouterService;

  // Define menus for different roles
    menus: Record<string, MenuItem[]> = {
    admin: [
      { title: 'Dashboard', icon: 'fa-home', link: '/admin/dashboard' },
      {
        title: 'User Management',
        icon: 'fa-users-cog',
        subItems: [
          { title: 'Admins', link: '/admin/user_management/user_list?role=admin' },
          { title: 'Authors', link: '/admin/user_management/user_list?role=author' },
          { title: 'Customers', link: '/admin/user_management/user_list?role=customer' },
        ],
      },
      {
        title: 'Projects',
        icon: 'fa-folder-open',
        subItems: [
          { title: 'Finished', link: '/admin/projects/finished' },
          { title: 'Unfinished', link: '/admin/projects/unfinished' },
        ],
      },
      {
        title: 'Messages',
        icon: 'fa-envelope',
        subItems: [
          { title: 'Inbox', link: '/admin/chat' },
          { title: 'Contact Us', link: '/admin/notification' },
        ],
      },
      {
        title: 'Profiles',
        icon: 'fa-user-circle',
        subItems: [
          { title: 'View', link: '/admin/profile/view' },
          { title: 'Edit', link: '/admin/profile/edit' },
        ],
      },
      {
        title: 'Blog Management',
        icon: 'fa-blog',
        subItems: [
          { title: 'New', link: '/admin/blog-management/new' },
          { title: 'Draft', link: '/admin/blog-management/view' },
          { title: 'Published', link: '/admin/blog-management/view' },
          { title: 'Archived', link: '/admin/blog-management/view' },
        ],
      },
      {
        title: 'Accounting',
        icon: 'fa-file-invoice-dollar',
        subItems: [
          { title: 'Expenses', link: '/admin/accounting/expenses' },
          { title: 'Invoices', link: '/admin/accounting/invoices' },
          { title: 'Tax Reports', link: '/admin/accounting/tax_reports' },
        ],
      },
    ],
    author: [
      { title: 'Dashboard', icon: 'fa-home', link: '/author/dashboard' },
      {
        title: 'Profiles',
        icon: 'fa-user-circle',
        subItems: [
          { title: 'View', link: '/author/profile/view' },
          { title: 'Edit', link: '/author/profile/edit' },
        ],
      },
      {
        title: 'Messages',
        icon: 'fa-envelope',
        subItems: [
          { title: 'Approved', link: '/author/chat' },
          { title: 'Unapproved', link: '/author/chat' },
        ],
      },
      {
        title: 'Blog Management',
        icon: 'fa-blog',
        subItems: [
          { title: 'New', link: '/author/blog_management/new' },
          { title: 'Draft', link: '/author/blog_management/view' },
          { title: 'Published', link: '/author/blog_management/view' },
          { title: 'Archived', link: '/author/blog_management/view' },
        ],
      },
    ],
    customer: [
      { title: 'Dashboard', icon: 'fa-home', link: '/customer/dashboard' },
      {
        title: 'Projects',
        icon: 'fa-folder-open',
        subItems: [
          { title: 'Project1', link: '/customer/project1' },
          { title: 'Project2', link: '/customer/project2' },
        ],
      },
      {
        title: 'Profiles',
        icon: 'fa-user-circle',
        subItems: [
          { title: 'View', link: '/customer/profile/view' },
          { title: 'Edit', link: '/customer/profile/edit' },
        ],
      },
      {
        title: 'Messages',
        icon: 'fa-envelope',
        subItems: [
          { title: 'Approved', link: '/customer/chat' },
          { title: 'Unapproved', link: '/customer/chat' },
        ],
      },
      {
        title: 'Invoices',
        icon: 'fa-file-invoice',
        subItems: [
          { title: 'Invoice 1', link: '/invoices/1' },
          { title: 'Invoice 2', link: '/invoices/2' },
        ],
      },
    ],
  };

  get menuItems(): MenuItem[] {
    // const role = this.roleService.getRole() ?? 'customer';

    const role = localStorage.getItem('author')?? 'customer';

    return this.menus[role] ?? [];
  }

  @action
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @action
  toggleSubMenu(menuTitle: string) {
    this.activeMenu = this.activeMenu === menuTitle ? null : menuTitle;
  }

    @action
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    // Redirect to login page
    this.router.transitionTo('/login'); 
  }
}