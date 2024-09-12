<h1 align="center">Smartsoft - A collection of libraries for Angular, NestJS and Ionic projects</h1>

<p align="center">
  <a href="https://github.com/emiljuchnikowski/smartsoft001/issues">Submit an Issue</a>

[//]: # (  ·)

[//]: # (  <a href="">Blog</a>)
  <br>
  <br>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@smartsoft001/cli">
    Smartsoft CLI
  </a>&nbsp;
</p>

<hr>

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

### Setting Up new Project

Install the Smartsoft CLI globally:
```
npm install @smartsoft001/cli -g
```

Prepare system dependencies to work with the framework:
```
smart prepare
```

Create project:
```
smart init --name [name]
```

Checkout the CLI for more commands <a href="https://www.npmjs.com/package/@smartsoft001/cli">Smartsoft CLI</a>

### Add to existing Project

Install the Smartsoft CLI
```
npm install @smartsoft001/cli -g
```

## Overview

### Generate
Use generate command to generate libraries or domains. Has an alias g.

Generate shared library
```
smart generate library [name] [--type=default]
```
or
```
smart g library [name] [--type=default]
```
<table>
    <tbody><tr>
        <td>name</td>
        <td>Library name</td>
    </tr>
    <tr>
        <td>--type</td>
        <td>
            Type of library (default: default)
            <ul>
                <li>angular - angular library</li>
                <li>default - nodejs library</li>
            </ul>        
        </td>
    </tr>
</tbody></table>

Generate domain
```
smart g domain [name]
```

## Contributing

If you find a bug, inconsistency or have a suggestion, than <a href="https://github.com/emiljuchnikowski/smartsoft001/issues">submit an Issue</a>
