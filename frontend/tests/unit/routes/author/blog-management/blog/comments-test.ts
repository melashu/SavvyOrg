import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Unit | Route | author/blog-management/blog/comments', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup(
      'route:author/blog-management/blog/comments',
    );
    assert.ok(route);
  });
});
