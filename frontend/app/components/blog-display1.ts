/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { blogsApi } from '../redux/blogs-api';
import ReduxStoreService from 'frontend/services/redux-store';

interface Blog {
  _id: string;
  title: string;
  authorName: string;
  content: string;
  status: string;
  createdAt: string;
}

export default class BlogDisplay extends Component {
  @service reduxStore!: ReduxStoreService; 
  @tracked blogs: Blog[] = [];
  @tracked loading = true;
  @tracked error: string | null = null;
  @tracked page = 1;
  @tracked totalPages = 1;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.loadBlogs();
  }

  async loadBlogs() {
    this.loading = true;

    try {
    const response = await this.reduxStore.store.dispatch(
      blogsApi.endpoints.getBlogs.initiate(this.page)
    );
        const data = await response.data;
        this.blogs = data.blogs;
        this.totalPages = data.totalPages;
    } catch (error) {
      this.error = 'Could not load blogs.';
    } finally {
      this.loading = false;
    }
  }

  @action
  async deleteBlog(id: string) {
    try { 
      await this.reduxStore.store.dispatch(
      blogsApi.endpoints.deleteBlog.initiate(id)
    );
        this.blogs = this.blogs.filter((blog) => blog._id !== id);
    } catch (error) {
      this.error = 'Could not delete the blog.';
    }
  }

  @action
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBlogs();
    }
  }

  @action
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadBlogs();
    }
  }
}
