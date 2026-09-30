# Authoritative payment amounts

`ITransInternalService.create` must return an `amount` computed from trusted order
data on the server. It must be a positive safe integer in the provider's smallest
currency unit. Missing, fractional, non-finite, string or unsafe integer values
are rejected before calling the payment operator. The client-supplied amount is
never a fallback; it remains in the request contract for compatibility.

This deliberately changes the previous permissive default. The built-in dummy
internal provider does not approve an amount and therefore cannot start payments.
Configure an internal service (or the trusted internal API) before enabling payment
creation. Merely echoing the request amount in that service defeats the protection.
Validate customer/order access, inventory, currency, discounts, tax and shipping
there, and compare the settled payment with that order before fulfillment.

This change does not implement a shop price calculator or authenticate checkout:
those are application responsibilities. Existing correctly configured providers
returning a valid authoritative amount continue to work.
