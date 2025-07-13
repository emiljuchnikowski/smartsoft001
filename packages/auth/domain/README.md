# @smartsoft001/auth-domain

## Installation

`npm i @smartsoft001/auth-domain`

## Token Factory

### create
Creates a new authentication token based on the provided credentials and grant type.

<table>
    <thead>
        <tr>
            <td>Param</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>options.request: IAuthTokenRequest</td>
        <td>The authentication request containing credentials and grant type.</td>
    </tr>
    <tr>
        <td>options.httpReq?: Request</td>
        <td>Optional HTTP request object for context.</td>
    </tr>
    <tr>
        <td>options.payloadProvider?: ITokenPayloadProvider</td>
        <td>Optional provider for customizing JWT payload.</td>
    </tr>
    <tr>
        <td>options.validationProvider?: ITokenValidationProvider</td>
        <td>Optional provider for custom validation rules.</td>
    </tr>
    <tr>
        <td>options.userProvider?: ITokenUserProvider</td>
        <td>Optional provider for custom user retrieval.</td>
    </tr>
</table>

## Interfaces

### IAuthTokenRequest

<table>
    <thead>
        <tr>
            <td>Property</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>grant_type</td>
        <td>"password" | "refresh_token" | "fb" | "google"</td>
    </tr>
    <tr>
        <td>username?</td>
        <td>Required for password grant type</td>
    </tr>
    <tr>
        <td>password?</td>
        <td>Required for password grant type</td>
    </tr>
    <tr>
        <td>refresh_token?</td>
        <td>Required for refresh_token grant type</td>
    </tr>
    <tr>
        <td>fb_token?</td>
        <td>Required for fb grant type</td>
    </tr>
    <tr>
        <td>google_token?</td>
        <td>Required for google grant type</td>
    </tr>
    <tr>
        <td>scope?</td>
        <td>Optional scope for the token</td>
    </tr>
    <tr>
        <td>client_id?</td>
        <td>Required for password, fb, and google grant types</td>
    </tr>
</table>

### IAuthToken

<table>
    <thead>
        <tr>
            <td>Property</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>access_token</td>
        <td>JWT token for authentication</td>
    </tr>
    <tr>
        <td>refresh_token</td>
        <td>Token for obtaining new access tokens</td>
    </tr>
    <tr>
        <td>expired_in</td>
        <td>Token expiration time in seconds</td>
    </tr>
    <tr>
        <td>token_type</td>
        <td>Always 'bearer'</td>
    </tr>
    <tr>
        <td>username?</td>
        <td>Optional username of authenticated user</td>
    </tr>
</table>

## Providers

### ITokenPayloadProvider

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>change(basePayload, data)</td>
        <td>Modifies the JWT payload before token creation</td>
    </tr>
</table>

### ITokenValidationProvider

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>check(data)</td>
        <td>Performs custom validation during token creation</td>
    </tr>
</table>

### ITokenUserProvider

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>get(query, request, httpReq?)</td>
        <td>Custom logic for user retrieval during authentication</td>
    </tr>
</table>

## Running unit tests

Run `nx test auth-domain` to execute the unit tests via [Jest](https://jestjs.io).
