---
title: Password hashing
section: Custom
order: 1
nextjs:
  metadata:
    title: Password hashing
    description: Replace the default MD5 password hash with PBKDF2 or your own algorithm, with one provider for login and CRUD, and upgrade stored hashes on the next login.
---

Login and stored user records hash passwords through one provider. Register a stronger hasher once and both use it, and existing users move to the new hash the next time they log in. {% .lead %}

---

## The default, and why to replace it

Out of the box a password is stored as its unsalted MD5 digest. That has been the behaviour since the first release, and it stays the default so that an upgrade never locks anyone out of an existing database. It is not a password hash: MD5 is fast to brute-force, and with no salt two users with the same password get the same digest. Replace it in any application whose credentials matter.

The framework hashes and verifies passwords in two places:

- [`@smartsoft001/auth-domain`](/docs/packages/auth-domain): `TokenFactory` verifies the password grant;
- [`@smartsoft001/crud-shell-app-services`](/docs/packages/crud-shell-app-services): `CrudService` hashes the `password` field on `create`, `createMany`, `update` and `updatePartial`.

Both take the `IPasswordHasher` registered under the `PASSWORD_HASHER` token from [`@smartsoft001/utils`](/docs/packages/utils), and fall back to `Md5PasswordHasher` when nothing is registered. The lookup is `moduleRef.get(PASSWORD_HASHER, { strict: false })`, the same as for the auth extension points, so the provider can live in any module of the application.

## Switch to PBKDF2

`Pbkdf2PasswordHasher` ships with `@smartsoft001/utils`. It derives a 256-bit key with PBKDF2-HMAC-SHA256 through Web Crypto, with a random 128-bit salt and 600,000 iterations by default, and compares in constant time. Register it next to the auth and CRUD modules:

{% snippet file="node/src/utils/password-hasher.example.ts" region="usage" /%}

The spec compiles that module with the real `AuthShellNestjsModule` and `CrudShellNestjsModule` and in-memory repositories. A user whose stored hash is still MD5 logs in, and the stored value becomes a PBKDF2 hash. A wrong password leaves the MD5 hash in place. A record created through `CrudService` gets a PBKDF2 hash too, so login and user management agree.

Check two things before you deploy it:

{% callout type="warning" title="The password column must hold 118 characters" %}
A hash is stored as `pbkdf2-sha256$<iterations>$<salt hex>$<key hex>`, which is 118 characters with the default work factor, against 32 for MD5. Widen a length-limited column first, or the upgrade fails on the first login.
{% /callout %}

{% callout type="warning" title="A rollback cannot read the new hashes" %}
Once users have logged in, their hashes are PBKDF2. A version of the application, or of the framework, configured with MD5 only cannot verify them, so those users cannot log in after a rollback. Roll back only to a version that registers the same hasher, or plan for password resets.
{% /callout %}

`new Pbkdf2PasswordHasher({ iterations })` sets another work factor, between 10,000 and 10,000,000. The count is stored in every hash, so a hash made with an older count still verifies after you raise it, and it is upgraded on the next login.

## What happens to existing hashes

`IPasswordHasher` has an optional third method, `needsRehash(hash)`. After a password has been verified, the built-in login asks it about the stored hash, and on `true` it writes a fresh hash of the same password. `Pbkdf2PasswordHasher` answers `true` for an MD5 digest and for a PBKDF2 hash with fewer iterations than configured. `Md5PasswordHasher` has no `needsRehash`, so with the default nothing is ever rewritten.

The write is conditional on the old hash, so it never overwrites a password changed in the meantime. When two logins with the right password race, the second write matches nothing. The second login then reads the user again and succeeds only if the hash stored now verifies.

Some hashes are never upgraded:

- accounts that never log in keep the old hash. Set a deadline, then require a password reset for whatever is left;
- users returned by an `AUTH_TOKEN_USER_PROVIDER` may come from somewhere else, so the factory does not rewrite them. That provider owns their storage and their migration;
- a validation provider with `replace: true` skips the built-in password check, and with it the upgrade.

## Write your own

Any algorithm works if it implements the three methods. This one uses Node's built-in scrypt, and a bcrypt or argon2 library fits the same shape:

{% snippet file="node/src/utils/custom-password-hasher.example.ts" region="usage" /%}

The spec checks the round trip, that a wrong password fails, that a legacy MD5 hash still verifies, and that `needsRehash` asks for an upgrade of anything the class did not produce. Register it the same way, `{ provide: PASSWORD_HASHER, useClass: ScryptPasswordHasher }`.

Keep `compare` able to verify the hashes already in your database, as the example does by delegating to `Md5PasswordHasher`. Without that, existing users cannot log in, and nothing is ever upgraded.

## Timing and rate limiting

A slow hasher is slow on purpose, and that makes response times say something. Verifying a real user costs a full hash, so to avoid answering an unknown username measurably faster, the login hashes the submitted password anyway before it rejects. Only the built-in check does that, so a custom user or validation provider has to take care of it. Timing is never perfectly even, and every login attempt now costs real CPU, so put rate limiting in front of the token endpoint and size the servers for the hashing cost.

`PasswordService.hash` and `compare` remain as static shortcuts to the MD5 default, for code that has to read legacy digests. They do not follow `PASSWORD_HASHER`: application code that hashes passwords itself, such as a seed script, should inject the token instead.
