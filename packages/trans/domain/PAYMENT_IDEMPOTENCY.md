# Payment refresh migration

Status refresh now requires `ITransInternalService.refreshOnce(trans, key)`.
It never falls back to the legacy `refresh` method for fulfillment. The handler
must atomically deduplicate the business effect in durable storage and return the
same receipt when the key is replayed. A method rename without deduplication does
not implement the contract. Use an order transaction/outbox and a unique key;
external effects need equivalent idempotency at their own boundary.

The framework derives the key from transaction ID, operator, external payment ID
and target status. All instances and retries use that same key, including a retry
after fulfillment succeeded but persisting the local status failed. A mutex in
one Node process or marking the payment complete before fulfillment is insufficient.
Failures preserve the previous persisted status so retries can recover. Operators
are still queried for the actual status; notification content is not authoritative.

For the built-in HTTP internal-service adapter, explicitly set
`TransConfig.idempotentInternalApi = true` only after the target API implements
durable `Idempotency-Key` semantics. The adapter sends that header on PUT. Missing
configuration fails closed; merely setting the flag does not provide deduplication.

This is a deliberate compatibility change. Existing custom services must implement
the new method before enabling status transitions. `refresh` remains available for
other existing flows (including refunds), which require their own idempotency review.
The library cannot make arbitrary external effects exactly-once; production testing
must cover independent processes, database transactions, crashes and replayed receipts.
