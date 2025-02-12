/* eslint-disable @typescript-eslint/no-explicit-any */
import Service from '@ember/service';
import { store } from 'frontend/redux/store';

export default class ReduxStoreService extends Service {
  store = store;
  static store: any;
}
