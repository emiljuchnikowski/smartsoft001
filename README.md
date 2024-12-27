<h1 align="center">Smartsoft - A collection of libraries for Angular, NestJS and Ionic projects</h1>

![Last Commit](https://img.shields.io/github/last-commit/emiljuchnikowski/smartsoft001)
![Last Commit](https://img.shields.io/github/issues/emiljuchnikowski/smartsoft001)
![Contributors](https://img.shields.io/github/contributors/emiljuchnikowski/smartsoft001)


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

## Contributing

If you find a bug, inconsistency or have a suggestion, than <a href="https://github.com/emiljuchnikowski/smartsoft001/issues">submit an Issue</a>
