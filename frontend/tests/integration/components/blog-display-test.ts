import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | blog-display', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BlogDisplay />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <BlogDisplay>
        template block text
      </BlogDisplay>
    `);

    assert.dom().hasText('template block text');
  });
});
