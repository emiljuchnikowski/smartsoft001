---
title: Item page
section: CRUD
order: 4
frameworks: [angular, react]
nextjs:
  metadata:
    title: CRUD item page
    description: The create, details and update modes of the CRUD item page in Angular and React, the form built from field metadata, and the buttons and permissions of each mode.
---

The item page is the record view, `smart-crud-item-page` in Angular and `SmartCrudItemPage` in React. One component covers creating, reading and editing, and which of the three it is doing is decided by the route and the configuration. {% .lead %}

---

## Modes

The page picks its mode on initialisation and can change it afterwards without a navigation.

{% framework name="angular" %}

| Mode      | Entered when                                                              | Renders                                                                |
| --------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `create`  | The current URL ends with `/add`, which is the `add` route.               | An empty form of the fields marked `create`.                           |
| `details` | Any other URL, when `details` is set on the configuration.                | The read-only view of the fields marked `details`.                     |
| `update`  | Any other URL when `details` is not set, or from the details edit button. | A form of the fields marked `update`, filled with the selected record. |

Outside create mode the page subscribes to the route parameters and selects the record by its id, so the store drives what is displayed. It also watches the query parameters: an `edit` parameter switches a details view into update mode, which is how a link can open a record ready to be edited.

With `routing: true` these routes already exist. The feature module maps `add` and `:id` to this page, and the empty path to the [list page](/docs/crud/list-page).

{% callout type="note" title="Three earlier defects on this page are fixed" %}
An earlier release declared the signals that feed the template without creating them, so the first change detection failed in every mode. The release after it rendered the page but could not submit it: the add and save buttons read the form through a `viewChildren` signal as if it were an array and threw `TypeError: Cannot read properties of undefined (reading 'valid')` before the facade was called. The release after that could submit but created nothing in create mode: the page handed the unique-value provider over after the first render, the form component built a second group, and the rendered inputs stayed bound to the first one while the add button validated the second, empty one. All three are repaired. The page now reaches the form through `getForm()` on the base component, `create` and `updatePartial` are called with the value of the group the inputs write to, and the `crud-item-page` dynamic component key is honoured, so an application can register its own body for this page.
{% /callout %}

{% /framework %}

{% framework name="react" %}

The React page has no route of its own to read. Its `id` prop decides between creating and a record, and `basePath` is where it goes after a create or a save.

| Mode      | Entered when                                                                                        | Renders                                                                |
| --------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `create`  | The page has no `id`, which is how `SmartCrudPages` renders it on `basePath/add`.                   | An empty form of the fields marked `create`.                           |
| `details` | The page has an `id` and `details` is set on the configuration.                                     | The read-only view of the fields marked `details`.                     |
| `update`  | The page has an `id` and `details` is not set, or `?edit=1` is in the URL, or from the edit button. | A form of the fields marked `update`, filled with the selected record. |

With an `id` the page selects the record through the facade, so the store drives what is displayed, and it watches the URL of the navigation adapter: an `edit` query parameter switches a details view into update mode, which is how a link can open a record ready to be edited. The mode is set once, when the page is created, so an application that renders adding and a record from one route gives the page a `key` that changes between the two, as `SmartCrudPages` does.

{% snippet file="react/src/crud/crud-item-page.example.tsx" region="usage" /%}

The spec renders the route without an id and asserts the `add` heading over an empty form, then fills the title in and asserts that the add button sends `POST https://api.example.com/notes` with it and moves the history to `/notes`. With the id `1` it asserts the single `GET https://api.example.com/notes/1`, the heading `Shopping - details` over the read-only content, the edit button turning the page into `Shopping - change` with the title filled in, `?edit=1` opening the form directly, save sending `PATCH https://api.example.com/notes/1` with `{ title, id }` and returning to the details, and cancel returning to them without a request.

{% /framework %}

---

## The form

{% framework name="angular" %}

Nothing about the form is written by hand. The page passes the mode, the model class, the unique-value provider and any `inputComponents` overrides to the form component, and the form factory builds the reactive controls from the field metadata: one control per field whose block for that mode is present and permitted, with the validators that the metadata implies. Required, email, phone number and national-identifier checks come from the field type and the `required` flag; minimum and maximum, length limits and the confirmation companion control come from the same options; and a field with an `enabled` specification is enabled or disabled reactively as the rest of the form changes.

Uniqueness is asynchronous. For a field declared unique the page asks the backend whether any other record already carries that value, excluding the record being edited, and the control stays invalid while one does. The page puts that provider in place before its first render, so in create mode the group is built exactly once.

The group is rebuilt whenever the form options change, which in update mode happens when the selected record arrives from the store. The form component keeps the current group in a signal, so the rendered inputs, the `valueChange`, `valuePartialChange` and `validChange` outputs, and the group the buttons validate through `getForm()` always refer to the same build. A build that finishes after a newer one has started is discarded.

{% /framework %}

{% framework name="react" %}

Nothing about the form is written by hand. The standard body, `SmartCrudItemPageStandard`, builds it with `useCrudItemPageBase`: `getCrudFormOptions` makes the form options of the mode, with a fresh model in create mode and a model filled from the selected record otherwise, the model class, the unique-value provider and any `inputComponents` overrides, and the `FormFactory` of [`@smartsoft001/react`](/docs/packages/react) builds the controls from the field metadata, one per field whose block for that mode is present and permitted, with the validators the metadata implies. `SmartForm` renders them and reports the value, the changed fields and the validity back to the page.

Uniqueness is asynchronous. For a field declared unique the page asks the backend whether any other record already carries that value, excluding the record being edited, and the control stays invalid while one does. The page keeps one provider for its lifetime, because a new one would build the form again.

A new form is built when the selected record, the mode or the provider change; in create mode the selected record is ignored. A value typed before the record has arrived is therefore replaced by the record's own, which is why the spec waits for the title to show `Shopping` before it edits it. The body puts the form it renders into `formRef`, and that is the form the add and save buttons validate.

### A body of your own

The page renders the component registered under the `crud-item-page` key in the `components` of `SmartProvider` in place of the standard body, inside a `.dynamic-content` element, with the same props: the `mode`, the `detailsOptions`, the unique-value provider, the change callbacks and `formRef`. A body that renders a form has to put it into `formRef`, which `useCrudItemPageBase` does, or the add and save buttons do nothing.

{% snippet file="react/src/crud/crud-page-bodies.example.tsx" region="item-body" /%}

These are the item half of the bodies registered on the [list page](/docs/crud/list-page). The spec renders the item route of the example above under those providers and asserts the registered form, its read-only view of a record, and that the add button sends the title typed into it, which only works because the form is in `formRef`.

{% /framework %}

When the form is not valid the page does not submit. It collects the invalid controls, translates their labels through the `MODEL.<key>` keys, and shows the first three in a toast, walking into nested groups and arrays so a bad value deep in an object is still named. This holds for both frameworks.

---

## Buttons and permissions

The page header shows a back button, hides the menu button, and carries the title. In create mode the title is the add label; in the other two it is the record's own title, taken from the field named by `titleKey` on the model, followed by the translated mode.

| Mode      | Buttons                         | What they do                                                                                                                                                         |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`  | Add                             | Validates, creates the record through the facade, and navigates back.                                                                                                |
| `update`  | Save, and Cancel with `details` | Save sends a partial update carrying the id, then returns to the details view when there is one, otherwise navigates back. Cancel returns to details without saving. |
| `details` | Edit                            | Switches to update mode in place. Shown only when `edit` is set and the model's update specification accepts this record.                                            |

Permissions are applied before any of that. The model's `create`, `update` and `remove` permissions are compared against the caller's roles, and `add`, `edit` or `remove` is switched off when they do not match, so a user without the right role never sees the button. In Angular the page service does it on the configuration; in React `useCrudPageConfig` does it on a copy, with the roles of `AuthService`.

{% framework name="react" %}

Where the table says the page navigates back, the React page navigates to its `basePath`, and goes back in the history only when it has none.

{% /framework %}

### What the configuration blocks add

`add`, `edit` and `details` are each either a boolean or an object, and the object form is how a generated screen is extended rather than replaced.

| Option              | Available on             | Effect                                                                                                                                        |
| ------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `components.top`    | `add`, `edit`, `details` | Rendered above the generated body, in that mode only.                                                                                         |
| `components.bottom` | `add`, `edit`, `details` | Rendered below the generated body, in that mode only.                                                                                         |
| `cellPipe`          | `details`                | Formats the values of the read-only view, receiving the record and the field name. The type also allows it on `edit`, where nothing reads it. |
| `inputComponents`   | the configuration root   | Replaces the generated editor for a named field, in every mode that renders a form.                                                           |

---

## Examples

{% framework name="angular" %}

There is no executable example for this page. The screens are described here from the component source, and the one page example in these docs mounts the [list page](/docs/crud/list-page), whose provider set is the closest working template for a test of this one. The item page needs more: the activated route, the location service, the crud service behind the unique check, the style, toast and details services, and a translate service.

{% /framework %}

{% framework name="react" %}

Both samples on this page are executed. Their specs render the real page, store and effects under a `SmartProvider` whose HTTP client runs over a stubbed `fetch`, the setup the [list page](/docs/crud/list-page) describes under testing, and assert the requests the page sends and what it renders. The validation toast and the unique check are described from the source and have no spec here.

{% /framework %}

---

## Where next

- [List page](/docs/crud/list-page) is the view this one is reached from.
- [Configuration](/docs/crud/configuration) lists the `add`, `edit` and `details` options in full.
- [Filters and search](/docs/crud/filters-and-search) covers the query the list passes around.
- [Overview](/docs/crud/overview) has the routing that puts both pages on the map.
