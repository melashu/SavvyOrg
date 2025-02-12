/* eslint-disable prettier/prettier */
// app/controllers/blogs/detail.ts
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { blogsApi } from '../../redux/blogs-api';
import ReduxStoreService from 'frontend/services/redux-store';
import config from 'frontend/utils/config';

const BASE_URL = config();

interface Blog {
  _id: string;
  title: string;
  authorId: string;
  content: string;
  status: string;
  image?: string;
  createdAt: string;
}

export default class BlogsDetailController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @tracked blog: Blog | null = null;
  @tracked loading: boolean = true;
  @tracked error: string | null = null;
  @tracked blogImage!: string;


    // Observe the model change
  set model(value: string) {
    if (value) {
      this.fetchBlog(value);
    }
  }

  @action
  async fetchBlog(id: string) {
    this.loading = true;
try{
    const response = await this.reduxStore.store.dispatch(
               blogsApi.endpoints.fetchBlogById.initiate(id)
             );
        this.blog = response.data;
        this.blogImage =`${BASE_URL}/${String(this.blog?.image).replace(/\\/g, '/')}`
    } catch (err) {
      console.error('Error fetching blog:', err);
      this.error = 'Failed to load blog post.';
    } finally {
      this.loading = false;
    }
  }
}