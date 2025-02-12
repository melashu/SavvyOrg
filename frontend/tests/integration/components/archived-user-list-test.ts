import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | archived-user-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<ArchivedUserList />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <ArchivedUserList>
        template block text
      </ArchivedUserList>
    `);

    assert.dom().hasText('template block text');
  });
});
