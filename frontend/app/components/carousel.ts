/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Slide {
  image: string;
  alt: string;
}

interface CarouselArgs {
  slides: Slide[];
}

export default class CarouselComponent extends Component<CarouselArgs> {
  @tracked currentSlide = 0;

  get slides() {
    return this.args.slides || [];
  }

  get totalSlides() {
    return this.slides.length;
  }

  @action
  prevSlide() {
    console.log('Prev Slide Clicked');
    if (this.totalSlides > 0) {
      this.currentSlide =
        (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    }
  }

  @action
  nextSlide() {
    console.log('Next Slide Clicked');
    if (this.totalSlides > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }
  }
}
