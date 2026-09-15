// #region usage
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import {
  IAuthToken,
  TokenConfig,
  TokenFactory,
  User,
} from '@smartsoft001/auth-domain';
import { FbService } from '@smartsoft001/fb';
import { GoogleService } from '@smartsoft001/google';
import { PasswordService } from '@smartsoft001/utils';

/** Only client ids listed in `TokenConfig.clients` may ask for a token. */
export const DOCS_CLIENT_ID = 'docs-client';

/**
 * Array-backed stand-in for the TypeORM `Repository<User>` that
 * `TypeOrmModule.forFeature(ENTITIES)` binds in a real application.
 */
export class InMemoryUserRepository {
  constructor(readonly users: User[]) {}

  async findOne(criteria: Partial<User>): Promise<User | null> {
    return this.users.find((user) => matches(user, criteria)) ?? null;
  }

  async update(criteria: Partial<User>, patch: Partial<User>): Promise<void> {
    this.users
      .filter((user) => matches(user, criteria))
      .forEach((user) => Object.assign(user, patch));
  }
}

/**
 * `TokenFactory` narrows its update criteria with `{ disabled: { $ne: true } }`,
 * a Mongo-style operator mixed into what is otherwise a TypeORM entity partial.
 * The fake therefore has to understand both shapes.
 */
function matches(user: User, criteria: Partial<User>): boolean {
  const record = user as unknown as Record<string, unknown>;

  return Object.entries(criteria).every(([key, value]) => {
    if (value && typeof value === 'object' && '$ne' in value) {
      return record[key] !== (value as { $ne: unknown }).$ne;
    }

    return record[key] === value;
  });
}

/** One enabled user whose password is stored hashed, never in clear text. */
export async function createDocsUserRepository(): Promise<InMemoryUserRepository> {
  const user = new User();
  user.id = 'user-1';
  user.username = 'anna';
  user.password = await PasswordService.hash('secret');
  user.permissions = ['user'];
  user.disabled = false;

  return new InMemoryUserRepository([user]);
}

/**
 * Wires `TokenFactory` by hand. The Facebook and Google services are the only
 * collaborators that would reach the network, and the password grant never
 * calls them, so empty stubs are enough.
 */
export function createTokenFactory(
  repository: InMemoryUserRepository,
): TokenFactory {
  const config: TokenConfig = {
    expiredIn: 3600,
    clients: [DOCS_CLIENT_ID],
    secretOrPrivateKey: 'change-me',
  };

  const jwtService = {
    sign: () => 'signed.jwt',
  } as unknown as JwtService;

  return new TokenFactory(
    config,
    repository as unknown as Repository<User>,
    jwtService,
    {} as FbService,
    {} as GoogleService,
  );
}

/**
 * Runs the OAuth password grant: validate the request, load the user, compare
 * the hashed password, rotate the refresh token and sign the access token.
 */
export function issueToken(
  factory: TokenFactory,
  username: string,
  password: string,
  clientId: string,
): Promise<IAuthToken> {
  return factory.create({
    request: {
      grant_type: 'password',
      username,
      password,
      client_id: clientId,
    },
  });
}
// #endregion
