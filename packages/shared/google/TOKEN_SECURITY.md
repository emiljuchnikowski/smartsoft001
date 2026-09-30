# Google access-token client binding

Configure `TokenConfig.googleClientIds` from trusted server configuration before
enabling the Google grant. Direct GoogleService callers must pass that allowlist
to getUserId/getData. An empty list fails closed. Never use an allowlist supplied
by the login request.

The existing access-token tokeninfo flow now requires a nonempty user_id,
audience and issued_to in the configured list, and positive finite expires_in.
Tokens are URL-encoded; provider HTTP exceptions are replaced with a safe 401
without the token-bearing request URL. Validity still depends on Google's tokeninfo
response; this is not an ID-token/JWT verifier and does not change the login protocol.

The returned tokeninfo fields are documented by [Google](https://developers.google.com/resources/api-libraries/documentation/oauth2/v2/java/latest/com/google/api/services/oauth2/model/Tokeninfo.html).
Existing consumers must configure their actual OAuth client IDs before rollout.
Provider-contract tests with real sandbox accounts remain required. This change
does not claim to validate Facebook tokens or implement account linking policies.
