# 📦 @smartsoft001/google

![npm](https://img.shields.io/npm/v/@smartsoft001/google) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/google)

## 🚀 Usage

`npm i @smartsoft001/google`

## 🛠️ Services & Methods

### GoogleService

Methods:

<table>
    <tr>
        <td>getUserId(token, clientIds)</td>
        <td>Makes a GET request to Google's OAuth tokeninfo endpoint to validate the token and returns its user_id</td>
    </tr>
    <tr>
        <td>getData(token, clientIds)</td>
        <td>Makes the same GET request to the tokeninfo endpoint, but processes the response data to return an object containing id and email</td>
    </tr>
</table>

### Access-token client binding

`clientIds` is required: the OAuth client ids your application trusts, loaded from server
configuration. Never use a list supplied by the login request. A token is accepted only when the
tokeninfo answer has a non-empty `user_id`, `audience` and `issued_to` both in `clientIds`, and a
positive finite `expires_in`. An empty list fails closed before any request is made.

Every failure is an `UnauthorizedException`. The token is URL-encoded, and HTTP errors are replaced
with `Invalid Google token`, so the token-bearing request URL never reaches logs. Validity still
depends on Google's tokeninfo response: this is not an ID-token (JWT) verifier and does not change
the login protocol. The returned fields are documented by
[Google](https://developers.google.com/resources/api-libraries/documentation/oauth2/v2/java/latest/com/google/api/services/oauth2/model/Tokeninfo.html).

**Migrating from 2.182.0 or earlier:** calls without `clientIds` no longer compile. Pass your
actual OAuth client ids before rolling out. With the auth stack, set `TokenConfig.googleClientIds`;
the `google` grant fails with `Google client IDs must be configured` until it is set.
