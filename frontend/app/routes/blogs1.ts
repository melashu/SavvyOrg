/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Route from '@ember/routing/route';
import { service } from '@ember/service';
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

export default class BlogsRoute extends Route {
  @service reduxStore!: ReduxStoreService;
  @tracked blogs: Blog[] = [];
  @tracked isLoading: boolean = true;
  @tracked errorMessage: string | null = null;
  @tracked currentPage: number = 1;
  @tracked totalPages: number = 1;
  @tracked selectedAuthor: string | null = null;

  async model() {
    await this.fetchBlogs(this.currentPage);
    return {
      blogs: this.blogs,
      totalPages: this.totalPages,
      currentPage: this.currentPage,
    };
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
}
