/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface TestimonyData {
  id: number;
  name: string;
  testimony: string;
  role: string;
  image: string;
}

export default class TestimonyCarouselComponent extends Component {
  @tracked testimonies: TestimonyData[] = [
    { id: 1, name: 'John Doe', testimony: 'Amazing service!', role: 'CEO', image: '/images/profile.jpg' },
    { id: 2, name: 'Jane Smith', testimony: 'Fantastic!', role: 'Manager', image: '/images/profile.jpg' },
    { id: 3, name: 'Mike Johnson', testimony: 'Blown away!', role: 'Engineer', image: '/images/profile.jpg' },
    { id: 4, name: 'Sara Williams', testimony: 'Top-notch!', role: 'HR', image: '/images/profile.jpg' },
    { id: 5, name: 'Tom Lee', testimony: 'Highly recommend!', role: 'CTO', image: '/images/profile.jpg' },
  ];

  @tracked currentSlideIndex = 0;

  // Dynamically calculate slides per view based on window width
  get slidesPerView(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    }
    return 1;
  }

  // Maximum slide index
  get maxIndex(): number {
    return Math.max(this.testimonies.length - this.slidesPerView, 0);
  }

  // Calculate the transform value for the slider
get transformValue(): string {
  return `${-(this.currentSlideIndex * (100 / this.slidesPerView))}%`;
}

  // Move to the next slide
  @action
  nextSlide(): void {
    if (this.currentSlideIndex < this.maxIndex) {
      this.currentSlideIndex++;
    }
  }

  // Move to the previous slide
  @action
  previousSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }
}
