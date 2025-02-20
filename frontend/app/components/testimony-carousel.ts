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
        return -(100 / this.itemsPerSlide) * this.currentIndex;
    }

    get isPrevDisabled() {
        return this.currentIndex === 0;
    }

    get isNextDisabled() {
        return this.currentIndex >= Math.ceil((this.testimonies.length || 0) / this.itemsPerSlide) - 1;
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
