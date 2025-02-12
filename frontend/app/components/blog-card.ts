/* eslint-disable prettier/prettier */
// app/components/blog-card.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';

interface BlogCardArgs {
  id: string;
  name: string;
  title: string;
  content: string;
  date?: string;
  onAuthorClick: (authorId: string) => void;
}

export default class BlogCardComponent extends Component<BlogCardArgs> {
  get shortenedContent() {
    const words = this.args.content.split(' ').slice(0, 20).join(' ');
    return words + (this.args.content.split(' ').length > 20 ? '...' : '');
  }

  @action
  handleAuthorClick() {
    this.args.onAuthorClick(this.args.id);
  }
}
