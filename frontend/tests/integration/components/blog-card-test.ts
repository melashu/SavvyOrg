import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | blog-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BlogCard />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <BlogCard>
        template block text
      </BlogCard>
    `);

    assert.dom().hasText('template block text');
  });
});
