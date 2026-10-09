# @smartsoft001/claude-plugins

![npm](https://img.shields.io/npm/v/@smartsoft001/claude-plugins) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/claude-plugins)

## Usage

`npm i @smartsoft001/claude-plugins`

## Marketplace

To add Claude plugins from the local marketplace:

```bash
claude plugin marketplace add ./node_modules/@smartsoft001/claude-plugins
```

## Plugins

The `smartsoft` marketplace ships three plugins. A project enables the one of its framework; both
framework plugins declare `smart-core` as a dependency, so the hooks come with either of them.

| Plugin | Enable in | Contents |
|--------|-----------|----------|
| `smart-core` | every project, as a dependency | Hooks (safety validation, sensitive files, audit logging, skill validation, formatting) and the `audit-log`, `format-code`, `project-conventions` and `safety-check` skills |
| `smart-angular` | Angular projects | The `angular-components-*` skills, the `angular-components` agent, `smart-crud` and `scaffold-nx-workspace` |
| `smart-react` | React projects | The `react-components-*` skills, the `react-components` agent, `react-provider`, `react-forms` and `smart-crud-react` |

```bash
claude plugin install smart-angular@smartsoft --scope project   # Angular project
claude plugin install smart-react@smartsoft --scope project     # React project
```

Projects that enabled the former `smart@smartsoft` plugin are moved to `smart-angular@smartsoft` by the
marketplace's `renames` map; run the `smart-angular` install above once to install it and `smart-core`.

### smart-core hooks

| Documentation | Description |
|---------------|-------------|
| [README](./src/plugins/smart-core/hooks/README.md) | Overview of available hooks |
| [CONFIG](./src/plugins/smart-core/hooks/CONFIG.md) | Configuration and customization guide |

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-new-feature.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/my-new-feature.
5. Submit a pull request.

For more details, see our [Contributing Guidelines](../../../CONTRIBUTING.md).

## Changelog

All notable changes to this project will be documented in the [CHANGELOG](../../../CHANGELOG.md).

## License

This project is licensed under the MIT License.
