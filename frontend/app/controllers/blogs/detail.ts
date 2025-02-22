/* eslint-disable prettier/prettier */
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

interface Comment {
  fullName: string;
  email: string;
  comment: string;
  createdAt: string;
}

export default class BlogsDetailController extends Controller {
  @service reduxStore!: ReduxStoreService;
  @tracked blog: Blog | null = null;
  @tracked loading: boolean = true;
  @tracked error: string | null = null;
  @tracked blogImage!: string;
  @tracked content = '';
  @tracked commenterName = '';
  @tracked commenterEmail = '';
  @tracked newComment = '';
  @tracked comments: Comment[] = [];
  quill: Quill | null = null;

  set model(value: string) {
    if (value) {
      const title = value.replace(/-/g, ' ');
      this.fetchBlog(title);
    }
  }

  @action
  async fetchBlog(title: string) {
    this.loading = true;
    try {
      const authorId = localStorage.getItem('authorIdForBlog');
      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.fetchBlogByTitle.initiate({ title: title, authorId: authorId })
      );

      console.log("blog detail response data");
      console.log(response.data);
      console.log("blog detail response data");

      this.blog = response.data;
      this.content = response.data.content;
      this.comments = response.data.comments || [];
      
      if (this.quill) {
        this.quill.root.innerHTML = this.content;
      }
      this.blogImage = `${BASE_URL}/${String(this.blog?.image).replace(/\\/g, '/')}`;
    } catch (err) {
      console.error('Error fetching blog:', err);
      this.error = 'Failed to load blog post.';
    } finally {
      this.loading = false;
    }
  }

  @action
  async postComment(event: Event) {
    event.preventDefault();
    // Fetch form inputs
    const name = (document.getElementById('fullName') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const comment = (document.getElementById('comment') as HTMLInputElement).value;

    // Validate inputs
    if (!name || !email || !comment) {
      toastr.warning('Please fill in all fields: name, email, and comment!', 'Warning');
      return;
    }
    
    const newComment: Comment = {
      fullName: name,
      email: email,
      comment: comment,
      createdAt: new Date().toISOString(),
    };
    
    try {
      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.postComment.initiate({
          blogId: this.blog?._id,
          comment: newComment,
        })
      );
      
      console.log('comment post response');
      console.log(response);
      console.log('comment post response');
      
      this.comments = [...this.comments, newComment];
      this.commenterName = '';
      this.commenterEmail = '';
      this.newComment = '';
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
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
          toolbar: false, 
        },
        readOnly: true, 
      });

      this.quill.on("text-change", () => {
        this.content = this.quill?.root.innerHTML || "";
      });

      if (this.content) {
        this.quill.root.innerHTML = this.content;
      }
    }
  }
}
