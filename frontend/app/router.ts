/* eslint-disable prettier/prettier */
import EmberRouter from '@ember/routing/router';
import config from 'frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('service');
  this.route('product');
  this.route('careers');
  this.route('about');
  this.route('contact');
  this.route('home', { path: '/' });
  this.route('blogs', function() {
    this.route('authors');
    this.route('detail', { path: '/detail/:title' });
  });
  this.route('login');
  this.route('register');

  this.route('admin', function() {
    this.route('dashboard');

    this.route('user_management', function() {
      this.route('user_list');
      this.route('archived_user_list');
    });

    this.route('profile', function() {
      this.route('view');
      this.route('edit');
    });

    this.route('blog-management', function() {
      this.route('new');
      this.route('view');
      this.route('edit');

      this.route('blog', function() {
        this.route('comments');
      });
    });
    this.route('chat');
    this.route('notification');
  });

  this.route('author', function() {
    this.route('dashboard');

    this.route('profile', function() {
      this.route('view');
      this.route('edit');
    });
    this.route('chat');

    this.route('blog-management', function() {
      this.route('new');
      this.route('view');
      this.route('edit');

      this.route('blog', function() {
        this.route('comments');
      });
    });
  });

  this.route('customer', function() {
    this.route('dashboard');

    this.route('profile', function() {
      this.route('view');
      this.route('edit');
    });
    this.route('chat');
  });

  this.route('user', function() {
    this.route('confirm', { path: '/confirm/:token' });

    this.route('password', function() {
      this.route('forgot-password');
      this.route('reset', { path: '/reset/:token' });
    });
  });
  this.route('unauthorized');

  this.route('testimony', function() {
    this.route('post');
  });
  this.route('blog-comment-table');
});
