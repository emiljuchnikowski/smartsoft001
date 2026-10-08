# 📦 @smartsoft001/fb

![npm](https://img.shields.io/npm/v/@smartsoft001/fb) ![downloads](https://img.shields.io/npm/dm/@smartsoft001/fb)

## 🚀 Usage

`npm i @smartsoft001/fb`

## 🛠️ Services & Methods

### FbService

Methods:

<table>
    <tr>
        <td>getUserId(token, appIds, credentials)</td>
        <td>Verifies the token with Graph's debug_token endpoint and returns its user_id</td>
    </tr>
    <tr>
        <td>getData(token, appIds, credentials)</td>
        <td>Verifies the token the same way, then reads the email and id from /me</td>
    </tr>
</table>

### Access-token app binding

A Facebook access token granted to any app identifies its user, so both methods first ask
`GET https://graph.facebook.com/debug_token?input_token=<token>&access_token=<appId>|<appSecret>`
whether the token was issued to your application. Both extra parameters are required and come
from server configuration, never from the login request:

- `appIds`: the Facebook app ids whose tokens you accept.
- `credentials`: `{ appId, appSecret }` (`IFbAppCredentials`) of the app that builds the app access
  token for `debug_token`. Keep the secret on the server.

A token is accepted only when the answer has `data.is_valid === true`, a `data.app_id` in `appIds`
and a non-empty `data.user_id`. `getData` additionally requires the `/me` id to equal that
`user_id`. An empty `appIds`, a missing app id or secret, or an empty token or one longer than 8192
characters fails closed before any request is made.

Every failure is an `UnauthorizedException`. The token and the app access token are URL-encoded, and
HTTP errors are replaced with `Invalid Facebook token`, so request URLs that carry the token and the
app secret never reach logs.

**Migrating from 2.188.0 or earlier:** calls without `appIds` and `credentials` no longer compile.
Pass your Facebook app id(s) and the app id and secret before rolling out. With the auth stack, set
`TokenConfig.fbAppIds` and `TokenConfig.fbAppCredentials`; the `fb` grant fails with
`Facebook app IDs and credentials must be configured` until both are set. `getUserId` now makes a
single `debug_token` request instead of calling `/me`, so test doubles of the HTTP call must answer
with `{ data: { is_valid, app_id, user_id } }`, and a spec that expected the raw HTTP error must
expect `Invalid Facebook token`.
