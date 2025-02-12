/* eslint-disable prettier/prettier */
// app/controllers/blogs/detail.ts
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
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
  @tracked content = '';
  quill: Quill | null = null;


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

        this.content = response.data.content;
          // Set Quill editor content
      if (this.quill) {
       this.quill.root.innerHTML = this.content;
      }
        this.blogImage =`${BASE_URL}/${String(this.blog?.image).replace(/\\/g, '/')}`
    } catch (err) {
      console.error('Error fetching blog:', err);
      this.error = 'Failed to load blog post.';
    } finally {
      this.loading = false;
    }
  }
  @action
initializeEditor(element: HTMLElement) {
  if (!element) {
    console.error("Editor container not found.");
    return;
  }

  if (!this.quill) {
    this.quill = new Quill(element, {
      theme: "snow",
      modules: {
        toolbar: false, // Disable toolbar
      },
      readOnly: true, // Make it read-only to prevent editing
    });

    this.quill.on("text-change", () => {
      this.content = this.quill?.root.innerHTML || "";
    });

    // Set initial content
    if (this.content) {
      this.quill.root.innerHTML = this.content;
    }
  }
}
}