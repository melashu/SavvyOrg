/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { testimonialApi } from 'frontend/redux/testimonial-api';
import ReduxStoreService from 'frontend/services/redux-store';
import type { EmptyObject } from '@glimmer/component/-private/component';

export default class TestimonialCarouselComponent extends Component {
    @service store: any;
    @service reduxStore!: ReduxStoreService;
    
    @tracked currentIndex = 0;
    @tracked itemsPerSlide = 1;
    @tracked testimonies: any[] = [];

    constructor(owner: unknown, args: EmptyObject) {
        super(owner, args);
        this.updateItemsPerSlide();
        window.addEventListener('resize', this.updateItemsPerSlide.bind(this));
        this.loadTestimonials();
    }

    willDestroy() {
        super.willDestroy();
        window.removeEventListener('resize', this.updateItemsPerSlide.bind(this));
    }

    async loadTestimonials() {
        try {
            const response = await this.reduxStore.store.dispatch(
                testimonialApi.endpoints.fetchTestimonials.initiate(undefined)
            );

            console.log("testimonials data from Api");
            console.log(response.data);
            console.log("testimonials data from Api");

            this.testimonies = response.data.testimonies || [];
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    }

    @action
    updateItemsPerSlide() {
        const width = window.innerWidth;
        if (width >= 1024) {
            this.itemsPerSlide = 3;
        } else if (width >= 768) {
            this.itemsPerSlide = 2;
        } else {
            this.itemsPerSlide = 1;
        }
    }

    get transformValue() {
    return `translateX(-${this.currentIndex * (100 / this.itemsPerSlide)}%)`;
    }

    get isPrevDisabled() {
        return this.currentIndex === 0;
    }

    get isNextDisabled() {
        let maxIndex = 0
      // Calculate the maximum index based on the number of items per slide
      const width = window.innerWidth;

      if (width >= 1024) {
            if(this.testimonies.length >=1 && this.testimonies.length <=3){
            maxIndex = 1;
            }else{
              maxIndex = (this.testimonies.length) - 2;
            }
        } else if (width >= 768) {
            if(this.testimonies.length >=1 && this.testimonies.length <=2){
            maxIndex = 1;
            }else{
              maxIndex = (this.testimonies.length) - 1;
            }
        } else {
            maxIndex = (this.testimonies.length) - 1;
        }
    return this.currentIndex >= maxIndex;
}


    @action
    nextSlide() {
        if (!this.isNextDisabled) {
            this.currentIndex += 1;
        }
    }

    @action
    previousSlide() {
        if (!this.isPrevDisabled) {
            this.currentIndex -= 1;
        }
    }
}
