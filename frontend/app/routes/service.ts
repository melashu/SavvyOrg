import Route from '@ember/routing/route';

export default class OurServiceRoute extends Route {
  headTags() {
    return [
      {
        type: 'meta',
        attrs: {
          name: 'description',
          content: 'Welcome to Savvy Bridge application.',
        },
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:title',
          content: 'Our Service | Savvy Bridge App',
        },
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:description',
          content: 'Welcome to Savvy Bridge application.',
        },
      },
      {
        type: 'meta',
        attrs: {
          property: 'og:image',
          content: 'https://www.savvybridge.com/images/blog.jpg',
        },
      },
      {
        type: 'link',
        attrs: {
          rel: 'canonical',
          href: 'https://www.savvybridge.com/',
        },
      },
    ];
  }
}
