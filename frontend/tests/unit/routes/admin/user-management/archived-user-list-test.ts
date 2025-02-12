import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module(
  'Unit | Route | admin/user_management/archived_user_list',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      const route = this.owner.lookup(
        'route:admin/user-management/archived-user-list',
      );
      assert.ok(route);
    });
  },
);
