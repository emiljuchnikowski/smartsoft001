import {
  DestroyRef,
  inject,
  Renderer2,
  Signal,
  TemplateRef,
} from '@angular/core';

/**
 * Turns a wrapper's captured `<ng-content>` into `NgComponentOutlet` content.
 *
 * The wrappers render a custom implementation registered through their
 * `*_STANDARD_COMPONENT_TOKEN` with `NgComponentOutlet`, which does not see the
 * wrapper's `<ng-content>`: without this, the implementation renders with an
 * empty slot. Capture the content once in the wrapper's template
 * (`<ng-template #content><ng-content /></ng-template>`), render it with
 * `ngTemplateOutlet` in the standard branch, and pass
 * `content: projectedContent()` to the outlet in the injected branch. Call it
 * in an injection context, typically a field initializer, with the template
 * query declared as a class field
 * (`viewChild.required<TemplateRef<unknown>>('content')`): Angular only
 * recognises signal queries declared as fields.
 *
 * The outlet takes DOM nodes, not a template, so the returned function renders
 * the template once into a detached view, destroyed with the wrapper. That
 * view only holds the `<ng-content>` instruction: the projected nodes belong to
 * the host's view, which keeps change-detecting them. Its root nodes are moved
 * into a single `display: contents` element, and that element is what gets
 * projected into the implementation's default (first) slot: the implementation
 * moves just that node in and out when it shows or hides its slot (e.g. on
 * open / close), and control flow at the root of the content keeps inserting
 * its nodes next to its anchor inside it. Memoised, because a new array makes
 * the outlet re-create the component.
 *
 * The element is a `<span>` for every wrapper rather than a tag parameter: a
 * `display: contents` element generates no box and has no role, so its tag
 * only matters for the HTML content model, and a `<span>` is allowed both in
 * flow content (a layout's `<main>`) and in phrasing-only contexts
 * (`smart-button` projects into a `<button>`, where a `<div>` is not allowed).
 * Block content inside a `<span>` would be non-conforming in authored HTML,
 * but this element is created through the DOM and generates no box, so it
 * renders exactly like direct children of the slot parent.
 *
 * Caveat: the projected nodes are children of that element, not of the
 * implementation's slot parent. Flex, grid and `gap` are unaffected (the
 * element's children take part in the parent's layout), but child-combinator
 * selectors on the slot parent (`> *`, `space-y-*`, `divide-*`, `*:` variants)
 * do not reach them, and `:first-child` / `:last-child` are evaluated among
 * the projected nodes only.
 */
export function outletContent(
  template: Signal<TemplateRef<unknown>>,
): () => Node[][] {
  const destroyRef = inject(DestroyRef);
  const renderer = inject(Renderer2);
  let content: Node[][] | undefined;

  return () => {
    if (!content) {
      const view = template().createEmbeddedView(undefined);
      const slot = renderer.createElement('span');
      renderer.setStyle(slot, 'display', 'contents');
      view.rootNodes.forEach((node) => renderer.appendChild(slot, node));
      destroyRef.onDestroy(() => view.destroy());
      content = [[slot]];
    }

    return content;
  };
}
