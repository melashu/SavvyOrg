/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { blogsApi } from "../redux/blogs-api";

interface Comment {
  _id: string;
  blogId: string;
  fullName: string;
  email: string;
  comment: string;
  createdAt: string;
  status?: string;
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

  @service declare reduxStore: any; // Inject Redux store service

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
          blog_id: this.blogId,
        })
      );

      if (response.data) {
        this.filteredComments = response.data.comments;
        this.totalPages = response.data.totalPages;
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
    this.blogId = urlParams.get("blog_id");
  }

  @action
  async handleStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const commentId = selectElement.dataset["commentId"];
    const newStatus = selectElement.value;

    if (!commentId) {
      console.error("Comment ID is missing.");
      return;
    }

    try {
      await this.reduxStore.store.dispatch(
        blogsApi.endpoints.changeCommentStatus.initiate({
          commentId,
          status: newStatus,
        })
      );

      this.filteredComments = this.filteredComments.map((comment) =>
        comment._id === commentId ? { ...comment, status: newStatus } : comment
      );

      console.log(`Status successfully updated to ${newStatus}`);
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Failed to change status. Please try again.");
    }
  }
}
