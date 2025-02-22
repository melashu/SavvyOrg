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
import { userProfileApi } from '../redux/user-profile-api';
import ReduxStoreService from 'frontend/services/redux-store';
import toastr from 'toastr';

type FileEventTarget = EventTarget & { files: FileList | null };


export default class BlogPostComponent extends Component {
  @service reduxStore!: ReduxStoreService; // Inject Redux Store service
  @tracked title = '';
  @tracked description = '';
  @tracked authorId = '';
  @tracked content = '';
  @tracked status = 'draft';
  @tracked image: File | null = null;
  @tracked message = '';
  quill: Quill | null = null;

  private accessId: string | null = localStorage.getItem('accessId');

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.fetchUserData();
  }

  @action
  initializeEditor(element: HTMLElement) {
    if (!element || !(element instanceof HTMLElement)) {
      console.error('Editor container not found or is not an HTMLElement.');
      return;
    }

    if (!this.quill) {
      this.quill = new Quill(element, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ['link', 'code-block', 'image'],
          ],
        },
      });
      this.quill.on('text-change', () => {
        this.content = this.quill?.root.innerHTML || '';
      });
    }
  }

async fetchUserData() {
  if (!this.reduxStore) {
    console.error('Redux store is not initialized.');
    return;
  }


  try {
    const userProfileData = await this.reduxStore.store.dispatch(
      userProfileApi.endpoints.fetchUserProfile.initiate(this.accessId)
    );
    this.authorId = userProfileData.data.id;
  } catch (error) {
    console.error('Unexpected error fetching user data:', error);
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

    // this.authorId = localStorage.getItem('userId') as string;

    const formData = new FormData();
    formData.append('title', this.title.trim());
    formData.append('description', this.description);
    formData.append('authorId', this.authorId);
    formData.append('content', this.content);
    formData.append('status', this.status);
    if (this.image) formData.append('image', this.image);

    try {
      const response = await this.reduxStore.store.dispatch(
        blogsApi.endpoints.postBlog.initiate(formData)
      );
      const message = response.data.message;
      if(message == 'blog_created'){
        toastr.success('Blog Created Successfully');
         // Clear input fields after successful submission
         const status = this.status;
        this.resetForm();
        window.location.href = `view?status=${status}`;
      }
    } catch (error) {
      console.error('Error posting blog:', error);
      this.message = 'An error occurred.';
    }
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.content = '';
    this.image = null;
    this.status = 'draft';
    this.quill?.setContents([]);
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
