# @smartsoft001/auth-shell-nestjs

## Installation

`npm i @smartsoft001/auth-shell-nestjs`

## Modules

### AuthShellNestjsModule

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>forRoot(options: { tokenConfig: TokenConfig })</td>
        <td>Configures the auth module with JWT, Passport, and TypeORM integration</td>
    </tr>
</table>

### Configuration Options

<table>
    <thead>
        <tr>
            <td>Property</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>tokenConfig.secretOrPrivateKey</td>
        <td>JWT secret key for token signing</td>
    </tr>
    <tr>
        <td>tokenConfig.expiredIn</td>
        <td>Token expiration time</td>
    </tr>
    <tr>
        <td>tokenConfig.googleClientIds</td>
        <td>Google OAuth client ids whose access tokens the google grant accepts. Required for the google grant (it fails with "Google client IDs must be configured" when unset). Load from server configuration, never from the request.</td>
    </tr>
    <tr>
        <td>tokenConfig.fbAppIds</td>
        <td>Facebook app ids whose access tokens the fb grant accepts. Required for the fb grant, together with tokenConfig.fbAppCredentials (it fails with "Facebook app IDs and credentials must be configured" when either is unset). Load from server configuration, never from the request.</td>
    </tr>
    <tr>
        <td>tokenConfig.fbAppCredentials</td>
        <td>{ appId, appSecret } of the Facebook app whose app access token asks Graph's debug_token endpoint to inspect fb tokens. Keep the secret in server configuration.</td>
    </tr>
</table>

## Controllers

### TokenController

<table>
    <thead>
        <tr>
            <td>Endpoint</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>POST /token</td>
        <td>Creates authentication tokens supporting password, refresh token, Facebook, and Google grant types</td>
    </tr>
</table>

## Running unit tests

Run `nx test auth-shell-nestjs` to execute the unit tests via [Jest](https://jestjs.io).
