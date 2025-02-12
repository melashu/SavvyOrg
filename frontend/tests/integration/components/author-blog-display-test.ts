import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | author-blog-display', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<AuthorBlogDisplay />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <AuthorBlogDisplay>
        template block text
      </AuthorBlogDisplay>
    `);

    assert.dom().hasText('template block text');
  });
});
