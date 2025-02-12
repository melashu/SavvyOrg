/* eslint-disable ember/classic-decorator-hooks */
/* eslint-disable prefer-rest-params */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { blogsApi } from '../redux/blogs-api';
import ReduxStoreService from 'frontend/services/redux-store';

interface Author {
  _id: string;
  name: string;
}

interface Blog {
  _id: string;
  title: string;
  authorId: Author;
  content: string;
  status: string;
  image?: string;
  createdAt: string;
}

export default class BlogsController extends Controller {
  @service router!: any; // Inject the Ember Router service
  @service reduxStore!: ReduxStoreService;

  @tracked blogs: Blog[] = [];
  @tracked isLoading: boolean = true;
  @tracked errorMessage: string | null = null;
  @tracked currentPage: number = 1;
  @tracked totalPages: number = 1;
  @tracked selectedAuthor: string | null = null;

  get currentRouteName() {
    return this.router.currentRouteName; // Access the current route name
  }
  async fetchBlogs(page: number, authorId?: string) {
    this.isLoading = true;
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        ...(authorId && { authorId }),
      }).toString();

      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.fetchBlogs.initiate(params)
      );
      const data = await response.data;
      this.totalPages = data.totalPages;
      this.blogs = data.blogs.map((blog: any) => ({
        _id: blog._id,
        title: blog.title,
        authorId: blog.authorId,
        content: blog.content,
        status: blog.status,
        createdAt: blog.createdAt,
      }));
    } catch (err) {
      console.error('Error fetching blogs:', err);
      this.errorMessage = 'Failed to load blog posts.';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async handleAuthorClick(authorId: string) {
    this.selectedAuthor = authorId;
    this.currentPage = 1;
    await this.fetchBlogs(this.currentPage, this.selectedAuthor);
  }

  @action
  async handleNextPage() {
    console.log('blogs next page');
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      await this.fetchBlogs(this.currentPage);
    }
  }

  @action
  async handlePreviousPage() {
    console.log('blogs previous page');
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      await this.fetchBlogs(this.currentPage);
    }
  }

async init() {
  super.init(); // Call the parent class init without arguments
  await this.fetchBlogs(this.currentPage); // Fetch blogs as part of initialization
}

}
