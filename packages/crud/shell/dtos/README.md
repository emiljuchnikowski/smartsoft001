# 📦 @smartsoft001/crud-shell-dtos

![npm](https://img.shields.io/npm/v/@smartsoft001/crud-shell-dtos) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/crud-shell-dtos)

## 🚀 Usage

`npm i @smartsoft001/crud-shell-dtos`

## 🛠️ DTOs

### UserDto
Fields:
<table>
    <tr><td>username</td><td>string (required, focused)</td></tr>
    <tr><td>password</td><td>string (required)</td></tr>
</table>

## 🧩 Interfaces

### IItemCreateData
<table>
    <tr><td>id</td><td>string</td></tr>
    <tr><td>type</td><td>'create'</td></tr>
    <tr><td>data</td><td>any</td></tr>
</table>

### IItemUpdateData
<table>
    <tr><td>id</td><td>string</td></tr>
    <tr><td>type</td><td>'update'</td></tr>
    <tr><td>data.removedFields</td><td>Array&lt;string&gt;</td></tr>
    <tr><td>data.updatedFields</td><td>{ [key: string]: any }</td></tr>
</table>

### IItemDeleteData
<table>
    <tr><td>id</td><td>string</td></tr>
    <tr><td>type</td><td>'delete'</td></tr>
</table>
