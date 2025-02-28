import Service from '@ember/service';

export default class HeadDataService extends Service {}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:head-data')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('head-data') declare altName: HeadDataService;`.
declare module '@ember/service' {
  interface Registry {
    'head-data': HeadDataService;
  }
}
