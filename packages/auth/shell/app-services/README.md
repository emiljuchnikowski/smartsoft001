# @smartsoft001/auth-shell-app-services

## Installation

`npm i @smartsoft001/auth-shell-app-services`

## Services

### AuthService

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Description</td>
        </tr>
    </thead>
    <tr>
        <td>create(req: IAuthTokenRequest, httpReq?: Request)</td>
        <td>Creates authentication token using the domain TokenFactory with automatic provider resolution</td>
    </tr>
</table>

## Running unit tests

Run `nx test auth-shell-app-services` to execute the unit tests via [Jest](https://jestjs.io).
