# 📦 @smartsoft001/utils

![npm](https://img.shields.io/npm/v/@smartsoft001/utils) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/angular)

## 🚀 Usage

`npm i @smartsoft001/angular`

## 📚 Storybook

To run Storybook locally:

```bash
nx storybook angular
```

This will start the Storybook development server, typically at http://localhost:4400.

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-new-feature.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/my-new-feature.
   Submit a pull request.

For more details, see our [Contributing Guidelines](../../../CONTRIBUTING.md).

## 📝 Changelog

All notable changes to this project will be documented in the [CHANGELOG](../../../CHANGELOG.md).

## Button Component

The `<smart-button>` component provides a flexible button with three shape variants, three color variants, five sizes, and support for loading, disabled, and confirm states.

### Usage

```html
<!-- Standard (default shape) -->
<smart-button [options]="{ click: onClick, variant: 'primary', size: 'md' }">
  Save
</smart-button>

<!-- Rounded -->
<smart-button [options]="{ click: onClick, variant: 'secondary', rounded: true }">
  Cancel
</smart-button>

<!-- Circular with icon -->
<smart-button [options]="{ click: onClick, variant: 'primary', circular: true }">
  <svg>...</svg>
</smart-button>

<!-- Loading state (pass a signal) -->
<smart-button [options]="{ click: onClick, loading: loadingSignal }">
  Submit
</smart-button>

<!-- Disabled -->
<smart-button [options]="{ click: onClick }" [disabled]="true">
  Disabled
</smart-button>

<!-- Confirm mode (shows confirmation before executing click) -->
<smart-button [options]="{ click: onDelete, confirm: true }">
  Delete
</smart-button>
```

### IButtonOptions

| Property   | Type                              | Default     | Description                          |
| ---------- | --------------------------------- | ----------- | ------------------------------------ |
| `click`    | `() => void`                      | *required*  | Click handler                        |
| `variant`  | `'primary' \| 'secondary' \| 'soft'` | `'primary'` | Color variant                        |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Button size                          |
| `rounded`  | `boolean`                         | `false`     | Rounded pill shape                   |
| `circular` | `boolean`                         | `false`     | Circular shape (for icon buttons)    |
| `confirm`  | `boolean`                         | `false`     | Show confirmation before click       |
| `loading`  | `Signal<boolean>`                 | -           | Show loading spinner when true       |
| `type`     | `'submit' \| 'button'`           | `'button'`  | HTML button type                     |
| `expand`   | `'block' \| 'full'`              | -           | Expand button width                  |
| `color`    | `string`                          | `'primary'` | Legacy color option                  |

### Inputs

| Input      | Type      | Default | Description          |
| ---------- | --------- | ------- | -------------------- |
| `options`  | `IButtonOptions` | *required* | Button configuration |
| `disabled` | `boolean` | `false` | Disabled state       |
| `class`    | `string`  | `''`    | External CSS class   |

### Variants

| Variant     | Description                                  |
| ----------- | -------------------------------------------- |
| `primary`   | Indigo background with white text            |
| `secondary` | White background with gray text and border   |
| `soft`      | Light indigo background with indigo text     |

### Sizes

| Size | Description    |
| ---- | -------------- |
| `xs` | Extra small    |
| `sm` | Small          |
| `md` | Medium (default) |
| `lg` | Large          |
| `xl` | Extra large    |

## 📜 License

This project is licensed under the MIT License.
