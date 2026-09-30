# Attachment access migration

The generic HTTP attachment routes now deny access unless `SharedConfig.attachmentPolicy`
explicitly returns `true`. The callback receives `{ operation, id, user }` for each
request, before storage is read or changed. Writes additionally require a valid JWT.
Downloads may be anonymous only when the policy deliberately permits that resource.

The application must resolve ownership/tenant and roles from trusted server data;
never grant access merely because an ID was supplied. A public product image and a
private customer document should have distinct policies. Do not configure an
unconditional `true` policy for private files. JWT validation alone is not ownership.
No default owner field is guessed for arbitrary application models.

Uploads accept one file, at most 10 MiB, and no form fields. They are buffered within
that bound before storage, so malformed, oversized and multi-file requests are rejected
without persisting partial content. Budget concurrent uploads at the proxy/application
layer (the buffer and concatenation can temporarily use about twice the file size),
set request timeouts, and configure content/type validation and isolated serving for
your use case. The declared MIME type and filename are not trusted content validation.
Applications needing streaming or larger uploads should provide a dedicated endpoint.

The response is sent only after the storage upload promise resolves. Failed storage
writes return an error instead of an upload receipt; storage adapters remain responsible
for aborting/cleaning partial writes. Repositories used directly by trusted application
code remain low-level APIs: their callers must enforce equivalent authorization.

This is a deliberate access-control change: existing consumers must configure a policy
before enabling these routes. It does not automatically migrate file ownership records.
