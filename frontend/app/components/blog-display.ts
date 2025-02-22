/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { blogsApi } from '../redux/blogs-api';
import ReduxStoreService from 'frontend/services/redux-store';
import toastr from 'toastr';
import Swal from 'sweetalert2';

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
  @tracked status: string | null = null;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    // Extract the role query parameter on component initialization
    this.status = this.getStatusFromUrl();
    this.loadBlogs();
  }

      // Method to extract the 'role' query parameter from the URL
  getStatusFromUrl(): string | null {
    const url = new URL(window.location.href); // Get the full current URL
    return url.searchParams.get('status'); // Extract the 'role' parameter
  }

  async loadBlogs() {
    this.loading = true;

    try {
    // const response = await this.reduxStore.store.dispatch(
    //   blogsApi.endpoints.getBlogs.initiate(this.page)
    // );
          const authorId = localStorage.getItem('userId');
          const role = localStorage.getItem('role');

    const response = await this.reduxStore.store.dispatch(
      blogsApi.endpoints.getBlogs.initiate({page: this.page, status: this.status, authorId: authorId, role: role }));

        const data = await response.data;

        
        console.log("blogs data");
        console.log(data);
        console.log("blogs data");


        this.blogs = data.blogs.map((blog: any) => ({
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        urlTitle: blog.title.trim().replace(/\s+/g, '-'),
        authorId: blog.authorId,
        content: blog.content,
        status: blog.status,
        totalPublished: blog.totalPublished,
        createdAt: blog.createdAt,
      }));
        this.totalPages = data.totalPages;
    } catch (error) {
      this.error = 'Could not load blogs.';
    } finally {
      this.loading = false;
    }
  }

 @action
 navigateToEdit(blogId: string) {
  window.location.href = `edit?id=${blogId}`;
}

  @action
  async deleteBlog(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        try {
          await this.reduxStore.store.dispatch(
            blogsApi.endpoints.deleteBlog.initiate(id)
          );
          this.blogs = this.blogs.filter((blog) => blog._id !== id);
          toastr.success('Blog deleted successfully');
          Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
        } catch (error) {
          this.error = 'Could not delete the blog.';
          toastr.error('Failed to delete blog');
          Swal.fire('Error!', 'Failed to delete the blog.', 'error');
        }
      }
    });
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
