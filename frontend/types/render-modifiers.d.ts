/* eslint-disable prettier/prettier */
declare module '@ember/render-modifiers' {
  import { Modifier } from 'ember-modifier';

  export const didInsert: Modifier;
  export const willDestroy: Modifier;
}
