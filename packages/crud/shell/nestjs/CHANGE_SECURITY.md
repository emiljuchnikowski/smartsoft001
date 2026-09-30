# Change subscription migration

Change subscriptions now require a valid JWT in `socket.handshake.auth.token`,
one explicit resource ID, and a configured `SharedConfig.changePolicy({ id, user })`
that returns true from trusted server-side ownership/tenant checks. Missing auth or
policy fails closed. Token expiry/signature and resource access are rechecked before
each emitted event, so revoked access does not keep streaming data.

Events contain only `{ id, type }`, not full documents or updateDescription fields.
Clients should refetch via an authorized resource endpoint. This is a deliberate
compatibility change: old clients that apply change payloads in place must migrate.
HTTP endpoints still need their own customer scoping and response DTOs.

The example keeps sockets disabled. The application must install/configure a Nest
WebSocket adapter to use this feature. Gateway/RxJS tests verify authorization and
cleanup but do not replace a deployed socket handshake/transport test.
