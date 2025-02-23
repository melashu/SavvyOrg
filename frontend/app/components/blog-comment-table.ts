import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { blogsApi } from '../redux/blogs-api';
import { inject as service } from "@ember/service";

interface Comment {
  blogId: string;
  fullName: string;
  email: string;
  comment: string;
  createdAt: string;
}

interface BlogCommentTableArgs {
  comments: Comment[];
  blogId: string;
}

export default class BlogCommentTableComponent extends Component<BlogCommentTableArgs> {
  @tracked filteredComments: Comment[] = [];
  @tracked loading = false;
  @tracked error: string | null = null;
  @tracked totalPages = 0;
  @tracked blogId: string | null = null;

  @service reduxStore!: any; // Inject Redux store service

  constructor(owner: unknown, args: BlogCommentTableArgs) {
    super(owner, args);
    this.getBlogIdFromUrl();
    if (this.blogId) {
      this.fetchBlogComments();
    }
  }

@action
async fetchBlogComments() {
  if (!this.blogId) {
    this.error = "Invalid blog ID.";
    return;
  }

  this.loading = true;

  try {
    const response = await this.reduxStore.store.dispatch(
      blogsApi.endpoints.getBlogCommentsByBlogId.initiate({
        page: 1,
        blog_id: this.blogId, // Ensure valid blogId
      })
    );

    const data = response.data;

    if (data) {
      this.filteredComments = data.comments;
      this.totalPages = data.totalPages;
    } else {
      this.filteredComments = [];
    }
  } catch (error) {
    this.error = "Could not load comments.";
  } finally {
    this.loading = false;
  }
}


getBlogIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  this.blogId = urlParams.get("blog_id") || null;
}
}
