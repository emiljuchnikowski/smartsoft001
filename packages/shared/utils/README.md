# 📦 @smartsoft001/utils

![npm](https://img.shields.io/npm/v/@smartsoft001/utils) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/utils)

`npm i @smartsoft001/utils`

## 🛠️ Services & Methods

### ArrayService

Methods:

<table>
    <tr>
        <td>addItem</td>
        <td>creating new array with pushed item</td>
    </tr>
    <tr>
        <td>removeItem</td>
        <td>creating new array without item</td>
    </tr>
    <tr>
        <td>sort</td>
        <td>return sorted array</td>
    </tr>
</table>

### GuidService

Methods:

<table>
    <tr>
        <td>create</td>
        <td>creating guid string</td>
    </tr>
</table>

### NipService

Methods:

<table>
    <tr>
        <td>isValid(nip: string)</td>
        <td>check valid nip format</td>
    </tr>
    <tr>
        <td>isInvalid(nip: string)</td>
        <td>check invalid nip format</td>
    </tr>
</table>

### ObjectService

Methods:

<table>
    <tr>
        <td>createByType<T>(data: any, type: any): T</td>
        <td>create object with data</td>
    </tr>
    <tr>
        <td>removeTypes(obj: any): any</td>
        <td>remove object type from data</td>
    </tr>
</table>

### PasswordService

Methods:

<table>
    <tr>
        <td>hash(p: string): Promise<string></td>
        <td>hash password text</td>
    </tr>
    <tr>
        <td>compare(p: string, h: string): Promise<boolean></td>
        <td>compare password text with hashed text</td>
    </tr>
</table>

### PeselService

Methods:

<table>
    <tr>
        <td>isValid(pesel: string)</td>
        <td>check pesel format</td>
    </tr>
    <tr>
        <td>isInvalid(pesel: string)</td>
        <td>check invalid pesel format</td>
    </tr>
</table>

### SpecificationService

Methods:

<table>
    <tr>
        <td>valid<T>(value: T, spec: { criteria: any }, custom: ISpecificationCustom = null): boolean</td>
        <td>checking if the value meets the specifications</td>
    </tr>
    <tr>
        <td>invalid<T>(value: T, spec: { criteria: any }, custom: ISpecificationCustom = null): boolean</td>
        <td>checking if the object does not meet the specifications</td>
    </tr>
    <tr>
        <td>getSqlCriteria(spec: { criteria: any }): string</td>
        <td>convert specification to sql</td>
    </tr>
</table>

### ZipCodeService

Methods:

<table>
    <tr>
        <td>isValid(code: string)</td>
        <td>check zip code format</td>
    </tr>
    <tr>
        <td>isInvalid(code: string)</td>
        <td>check invalid zip code format</td>
    </tr>
</table>

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

## 📜 License

This project is licensed under the MIT License.
