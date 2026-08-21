<h1 align="center">Smartsoft - A collection of libraries for Angular, NestJS and Ionic projects</h1>

![Last Commit](https://img.shields.io/github/last-commit/emiljuchnikowski/smartsoft001)
![Last Commit](https://img.shields.io/github/issues/emiljuchnikowski/smartsoft001)
![Contributors](https://img.shields.io/github/contributors/emiljuchnikowski/smartsoft001)
![Open Pull Requests](https://img.shields.io/github/issues-pr/emiljuchnikowski/smartsoft001)
![Build Status](https://github.com/emiljuchnikowski/smartsoft001/actions/workflows/publish.yml/badge.svg)
![Forks](https://img.shields.io/github/forks/emiljuchnikowski/smartsoft001?style=social)

<p align="center">
  <a href="https://github.com/emiljuchnikowski/smartsoft001/issues">Submit an Issue</a>

[//]: # (  ·)

[//]: # (  <a href="">Blog</a>)
[//]: # (  <br>)

[//]: # (  <br>)

[//]: # (</p>)

[//]: # ()
[//]: # (<p align="center">)

[//]: # (  <a href="https://www.npmjs.com/package/@smartsoft001/cli">)

[//]: # (    Smartsoft CLI)

[//]: # (  </a>&nbsp;)

[//]: # (</p>)

[//]: # ()
[//]: # (<hr>)

[//]: # (## Documentation)

[//]: # ()
[//]: # (Get started with Angular, learn the fundamentals and explore advanced topics on our documentation website.)

[//]: # ()
[//]: # (- [Getting Started][quickstart])

[//]: # (- [Architecture][architecture])

[//]: # (- [Components and Templates][componentstemplates])

[//]: # (- [Forms][forms])

[//]: # (- [API][api])

## Development Setup

### Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]

### Storybook

Component libraries are documented with Storybook. Install dependencies first (`npm install`), then start the
Storybook of the library you want to work on:

```
# Shared Angular components (http://localhost:4400)
npx nx storybook angular

# CRUD shell Angular components (http://localhost:4401)
npx nx storybook crud-shell-angular
```

Build a static Storybook (output in `dist/storybook/<project>`):

```
npx nx build-storybook angular
npx nx build-storybook crud-shell-angular
```

Serve the static build or run the interaction tests (requires a running Storybook on port 4400):

```
npx nx static-storybook angular
npx nx test-storybook angular
```

[//]: # (### Setting Up new Project)

[//]: # ()
[//]: # (Install the Smartsoft CLI globally:)

[//]: # (```)

[//]: # (npm install @smartsoft001/cli -g)

[//]: # (```)

[//]: # ()
[//]: # (Prepare system dependencies to work with the framework:)

[//]: # (```)

[//]: # (smart prepare)

[//]: # (```)

[//]: # ()
[//]: # (Create project:)

[//]: # (```)

[//]: # (smart init --name [name])

[//]: # (```)

[//]: # ()
[//]: # (Checkout the CLI for more commands <a href="https://www.npmjs.com/package/@smartsoft001/cli">Smartsoft CLI</a>)

[//]: # (### Add to existing Project)

[//]: # ()
[//]: # (Install the Smartsoft CLI)

[//]: # (```)

[//]: # (npm install @smartsoft001/cli -g)

[//]: # (```)

## Overview

### Domain-core
This library describes basic repository and tools for working with the repositories.
Full list of features [here](packages/shared/domain-core/README.md).

### Models
Models library is designed to enhance and manage data models in applications. This library provides decorators and utility 
functions that enable developers to define, manipulate, and validate models with rich metadata and custom behaviors. 
Full list of features [here](packages/shared/models/README.md).

### Users
Users library defines the entity for the user.

### Utils
Utils library has various services for Nip, Pesel, zip-code verification, password hashing, operations with objects and 
more. Check the full list of features [here](packages/shared/utils/README.md).

[//]: # (### Generate)
[//]: # (Use generate command to generate libraries or domains. Has an alias g.)

[//]: # (Generate shared library)

[//]: # (```)

[//]: # (smart generate library [name] [--type=default])

[//]: # (```)

[//]: # (or)

[//]: # (```)

[//]: # (smart g library [name] [--type=default])

[//]: # (```)

[//]: # (<table>)

[//]: # (    <tbody><tr>)

[//]: # (        <td>name</td>)

[//]: # (        <td>Library name</td>)

[//]: # (    </tr>)

[//]: # (    <tr>)

[//]: # (        <td>--type</td>)

[//]: # (        <td>)

[//]: # (            Type of library &#40;default: default&#41;)

[//]: # (            <ul>)

[//]: # (                <li>angular - angular library</li>)

[//]: # (                <li>default - nodejs library</li>)

[//]: # (            </ul>        )

[//]: # (        </td>)

[//]: # (    </tr>)

[//]: # (</tbody></table>)

[//]: # ()
[//]: # (Generate domain)

[//]: # (```)

[//]: # (smart g domain [name])

[//]: # (```)

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-new-feature.
3. Commit your changes: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/my-new-feature.
   Submit a pull request.

For more details, see our [Contributing Guidelines](./CONTRIBUTING.md).

## 📝 Changelog

All notable changes to this project will be documented in the [CHANGELOG](./CHANGELOG.md).

## 📜 License

This project is licensed under the MIT License.
