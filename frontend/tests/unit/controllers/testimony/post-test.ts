import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Unit | Controller | testimony/post', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:testimony/post');
    assert.ok(controller);
  });
});
