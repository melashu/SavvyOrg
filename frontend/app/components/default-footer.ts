/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';

export default class CustomFooter extends Component {
  // Dynamic data for Footer
  currentYear = new Date().getFullYear();
  companyName = 'Savvy Bridge';
  websiteUrl = 'https://www.savvybridge.com/';
}
