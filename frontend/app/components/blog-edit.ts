/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { blogsApi } from '../redux/blogs-api';
import ReduxStoreService from 'frontend/services/redux-store';
import toastr from 'toastr';

type FileEventTarget = EventTarget & { files: FileList | null };

export default class BlogEditComponent extends Component {
  @service reduxStore!: ReduxStoreService;
  @tracked title = '';
  @tracked description = '';
  @tracked authorId = '';
  @tracked content = '';
  @tracked status = 'draft';
  @tracked image: File | null = null;
  @tracked message = '';
  quill: Quill | null = null;

  private blogId: string | null = null;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.getBlogIdFromUrl();
    if (this.blogId) {
      this.fetchBlogData();
    }
  }

  getBlogIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.blogId = urlParams.get('id');
  }

  async fetchBlogData() {
    if (!this.blogId) {
      console.error("No blog ID found.");
      return;
    }
    try {
      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.fetchBlogById.initiate(this.blogId)
      );
      const blog = response.data;


      console.log("blog by id in blog edit page");
      console.log(blog);
      console.log("blog by id in blog edit page");
      
      if (blog) {
        this.title = blog.title;
        this.description = blog.description;
        this.authorId = blog.authorId;
        this.content = blog.content;
        this.status = blog.status;
          // Set Quill editor content
  if (this.quill) {
    this.quill.root.innerHTML = this.content;
  }
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      this.message = "Failed to load blog details.";
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
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["link", "code-block", "image"],
        ],
      },
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


  @action
  handleFileChange(event: Event) {
    const target = event.target as FileEventTarget;
    if (target.files && target.files[0]) {
      this.image = target.files[0];
    }
  }

  @action
  async handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.title || !this.description || !this.content || !this.status) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('content', this.content);
    formData.append('status', this.status);
    if (this.image) formData.append('image', this.image);

    try {
      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.updateBlog.initiate({ id: this.blogId, data: formData })
      );
      if (response.data.message === 'blog_updated') {
        toastr.success('Blog Updated Successfully');
        window.location.href = `view?status=${this.status}`;
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      this.message = 'An error occurred.';
    }
  }

  @action
  updateTitle(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.title = target.value;
  }

  @action
  updateDescription(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.description = target.value;
  }

  @action
  updateStatus(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.status = target.value;
  }
}
