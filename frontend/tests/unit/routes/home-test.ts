import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Unit | Route | home', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:home');
    assert.ok(route);
  });
});
