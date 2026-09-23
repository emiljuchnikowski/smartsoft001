---
title: Item page
section: CRUD
order: 4
nextjs:
  metadata:
    title: CRUD item page
    description: The create, details and update modes of smart-crud-item-page, the form built from field metadata, and the buttons and permissions of each mode.
---

`smart-crud-item-page` is the record view. One component covers creating, reading and editing, and which of the three it is doing is decided by the route and the configuration. {% .lead %}

---

## Modes

The page picks its mode on initialisation and can change it afterwards without a navigation.

| Mode      | Entered when                                                              | Renders                                                                |
| --------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `create`  | The current URL ends with `/add`, which is the `add` route.               | An empty form of the fields marked `create`.                           |
| `details` | Any other URL, when `details` is set on the configuration.                | The read-only view of the fields marked `details`.                     |
| `update`  | Any other URL when `details` is not set, or from the details edit button. | A form of the fields marked `update`, filled with the selected record. |

Outside create mode the page subscribes to the route parameters and selects the record by its id, so the store drives what is displayed. It also watches the query parameters: an `edit` parameter switches a details view into update mode, which is how a link can open a record ready to be edited.

With `routing: true` these routes already exist. The feature module maps `add` and `:id` to this page, and the empty path to the [list page](/docs/crud/list-page).

{% callout type="note" title="Two earlier defects on this page are fixed" %}
An earlier release declared the signals that feed the template without creating them, so the first change detection failed in every mode. The release after it rendered the page but could not submit it: the add and save buttons read the form through a `viewChildren` signal as if it were an array and threw `TypeError: Cannot read properties of undefined (reading 'valid')` before the facade was called. Both are repaired. The page now reaches the form through `getForm()` on the base component, `create` and `updatePartial` are called with the form value, and the `crud-item-page` dynamic component key is honoured, so an application can register its own body for this page.
{% /callout %}

---

## The form

Nothing about the form is written by hand. The page passes the mode, the model class, the unique-value provider and any `inputComponents` overrides to the form component, and the form factory builds the reactive controls from the field metadata: one control per field whose block for that mode is present and permitted, with the validators that the metadata implies. Required, email, phone number and national-identifier checks come from the field type and the `required` flag; minimum and maximum, length limits and the confirmation companion control come from the same options; and a field with an `enabled` specification is enabled or disabled reactively as the rest of the form changes.

Uniqueness is asynchronous. For a field declared unique the page asks the backend whether any other record already carries that value, excluding the record being edited, and the control stays invalid while one does.

When the form is not valid the page does not submit. It collects the invalid controls, translates their labels through the `MODEL.<key>` keys, and shows the first three in a toast, walking into nested groups and arrays so a bad value deep in an object is still named.

---

## Buttons and permissions

The page header shows a back button, hides the menu button, and carries the title. In create mode the title is the add label; in the other two it is the record's own title, taken from the field named by `titleKey` on the model, followed by the translated mode.

| Mode      | Buttons                         | What they do                                                                                                                                                         |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`  | Add                             | Validates, creates the record through the facade, and navigates back.                                                                                                |
| `update`  | Save, and Cancel with `details` | Save sends a partial update carrying the id, then returns to the details view when there is one, otherwise navigates back. Cancel returns to details without saving. |
| `details` | Edit                            | Switches to update mode in place. Shown only when `edit` is set and the model's update specification accepts this record.                                            |

Permissions are applied before any of that. The page service compares the model's `create`, `update` and `remove` permissions against the caller's roles and switches `add`, `edit` or `remove` off on the configuration when they do not match, so a user without the right role never sees the button.

### What the configuration blocks add

`add`, `edit` and `details` are each either a boolean or an object, and the object form is how a generated screen is extended rather than replaced.

| Option              | Available on             | Effect                                                                                                                                        |
| ------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `components.top`    | `add`, `edit`, `details` | Instantiated above the generated body, in that mode only.                                                                                     |
| `components.bottom` | `add`, `edit`, `details` | Instantiated below the generated body, in that mode only.                                                                                     |
| `cellPipe`          | `details`                | Formats the values of the read-only view, receiving the record and the field name. The type also allows it on `edit`, where nothing reads it. |
| `inputComponents`   | the configuration root   | Replaces the generated editor for a named field, in every mode that renders a form.                                                           |

---

## Examples

There is no executable example for this page. The screens are described here from the component source, and the one page example in these docs mounts the [list page](/docs/crud/list-page), whose provider set is the closest working template for a test of this one. The item page needs more: the activated route, the location service, the crud service behind the unique check, the style, toast and details services, and a translate service.

---

## Where next

- [List page](/docs/crud/list-page) is the view this one is reached from.
- [Configuration](/docs/crud/configuration) lists the `add`, `edit` and `details` options in full.
- [Filters and search](/docs/crud/filters-and-search) covers the query the list passes around.
- [Overview](/docs/crud/overview) has the routing that puts both pages on the map.
