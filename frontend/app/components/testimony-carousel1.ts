/* eslint-disable prettier/prettier */
/* eslint-disable prefer-rest-params */
/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { EmptyObject } from '@glimmer/component/-private/component';

export default class TestimonialCarouselComponent extends Component {
    @tracked currentIndex = 0; // Track the current slide index
    @tracked itemsPerSlide = 1; // Items per slide, changes based on screen size

    testimonies = [
        {
            name: "John Doe",
            role: "Software Engineer",
            image: "/images/profile.jpg",
            testimony: "This is an amazing service!",
        },
        {
            name: "Jane Smith",
            role: "Product Manager",
            image: "/images/profile.jpg",
            testimony: "Highly recommended for everyone.",
        },
        {
            name: "Mike Johnson",
            role: "CEO",
            image: "/images/profile.jpg",
            testimony: "A game-changer for our business!",
        },
        {
            name: "Abebe Kebede",
            role: "Software Engineer",
            image: "/images/profile.jpg",
            testimony: "This is an amazing service!",
        },
        {
            name: "Ermias Abebe",
            role: "Product Manager",
            image: "/images/profile.jpg",
            testimony: "Highly recommended for everyone.",
        },
        {
            name: "Temesgen Alemu",
            role: "CEO",
            image: "/images/profile.jpg",
            testimony: "A game-changer for our business!",
        },
    ];

    constructor(owner: unknown, args: EmptyObject) {
        super(owner, args); // Explicitly pass arguments
        this.updateItemsPerSlide();
        window.addEventListener('resize', this.updateItemsPerSlide.bind(this));
    }

    willDestroy() {
        super.willDestroy(); // No arguments to pass explicitly here
        window.removeEventListener('resize', this.updateItemsPerSlide.bind(this));
    }

    @action
    updateItemsPerSlide() {
        const width = window.innerWidth;
        if (width >= 1024) {
            this.itemsPerSlide = 3; // Desktop: 3 items per slide
        } else if (width >= 768) {
            this.itemsPerSlide = 2; // Tablet: 2 items per slide
        } else {
            this.itemsPerSlide = 1; // Mobile: 1 item per slide
        }
    }

    get transformValue() {
        return -(100 / this.itemsPerSlide) * this.currentIndex; // Calculate translateX value
    }

    get isPrevDisabled() {
        return this.currentIndex === 0;
    }

    get isNextDisabled() {
        return this.currentIndex >= Math.ceil(this.testimonies.length / this.itemsPerSlide) - 1;
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
