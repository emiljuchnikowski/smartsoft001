# 📦 @smartsoft001/utils

![npm](https://img.shields.io/npm/v/@smartsoft001/utils) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/utils)

## 🚀 Usage

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

### Password hashing

`PasswordService` hashes with an unsalted MD5 digest. That is the framework default and stays
so for compatibility with stored hashes, but MD5 is not a password hash: replace it for any
credentials that matter.

The framework never calls `PasswordService` directly. Login (`@smartsoft001/auth-*`) and the
`password` field of CRUD records (`@smartsoft001/crud-*`) use the `IPasswordHasher` registered
under the `PASSWORD_HASHER` token, and fall back to `Md5PasswordHasher` when there is none.
Register one provider anywhere in the Nest application to replace it everywhere:

```ts
{ provide: PASSWORD_HASHER, useClass: Pbkdf2PasswordHasher }
```

`Pbkdf2PasswordHasher` is the ready-made replacement: PBKDF2-HMAC-SHA256 through Web Crypto,
600,000 iterations by default, a random 128-bit salt and a 256-bit key, compared in constant
time. Before switching:

- the stored value is 118 characters (`pbkdf2-sha256$600000$<salt>$<key>`), so the password
  column must hold at least that;
- it still verifies MD5 hashes, and `needsRehash` reports them and hashes with fewer iterations
  than configured, so the built-in login upgrades them on the next successful login, with a
  conditional write; accounts that never log in keep the old hash, so set a reset deadline;
- a rollback to a version, or a hasher, that only knows MD5 cannot verify upgraded hashes;
- hashing is deliberately slow: rate-limit the login endpoint and size capacity for it.

For bcrypt, argon2 or anything else, implement `IPasswordHasher` (`hash`, `compare` and the
optional `needsRehash`). The guide with executed examples:
https://framework.smartflow.biz.pl/docs/password-hashing/.

<table>
    <tr>
        <td>PasswordService.hash(p: string): Promise&lt;string&gt;</td>
        <td>hash password text with the default MD5 hasher</td>
    </tr>
    <tr>
        <td>PasswordService.compare(p: string, h: string): Promise&lt;boolean&gt;</td>
        <td>compare password text with an MD5 hash</td>
    </tr>
    <tr>
        <td>IPasswordHasher</td>
        <td>hash(password), compare(password, hash), needsRehash?(hash)</td>
    </tr>
    <tr>
        <td>PASSWORD_HASHER</td>
        <td>injection token of the hasher the framework uses</td>
    </tr>
    <tr>
        <td>Md5PasswordHasher</td>
        <td>the default, unsalted MD5</td>
    </tr>
    <tr>
        <td>Pbkdf2PasswordHasher</td>
        <td>salted PBKDF2-SHA256; new Pbkdf2PasswordHasher({ iterations? })</td>
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

### RemoveHtmlService

Methods:

<table>
    <tr>
        <td>create(val: string | undefined | null): string</td>
        <td>strip HTML tags and decode HTML entities, returning '' for empty input</td>
    </tr>
</table>

### SlugService

Methods:

<table>
    <tr>
        <td>create(text: string | undefined | null): string</td>
        <td>convert text to a URL friendly slug, transliterating Polish characters</td>
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

## 🔧 Functions

### capitalize

<table>
    <tr>
        <td>capitalize(val: string): string</td>
        <td>capitalize first letter of a string</td>
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
