/**
 * Creates the initial admin user in the Cognito User Pool.
 *
 * Run once after cdk deploy (from the backend/ folder):
 *   npm run create-admin
 *
 * Reads USER_POOL_ID, ADMIN_EMAIL, and ADMIN_TEMP_PASSWORD from the root .env.local.
 * You can also override them inline:
 *   USER_POOL_ID=us-east-1_xxx ADMIN_EMAIL=admin@example.com npm run create-admin
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.local from the repo root (one level above backend/)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const USER_POOL_ID = process.env.USER_POOL_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@refugio-mental.org';
const ADMIN_TEMP_PASSWORD = process.env.ADMIN_TEMP_PASSWORD ?? 'TempPass123!';
const REGION = process.env.AWS_REGION ?? 'us-east-1';

if (!USER_POOL_ID) {
  console.error('Error: USER_POOL_ID environment variable is required.');
  console.error('  USER_POOL_ID=us-east-1_xxx ADMIN_EMAIL=admin@example.com npm run create-admin');
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: REGION });

async function createAdmin(): Promise<void> {
  console.log(`\nCreating admin user in User Pool: ${USER_POOL_ID}`);
  console.log(`  Email:  ${ADMIN_EMAIL}`);
  console.log(`  Region: ${REGION}\n`);

  // Check if user already exists
  const existing = await client.send(
    new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${ADMIN_EMAIL}"`,
      Limit: 1,
    })
  );

  if (existing.Users && existing.Users.length > 0) {
    console.log(`  skip  — user ${ADMIN_EMAIL} already exists.`);
    return;
  }

  // Create the user (SUPPRESS skips the welcome email with temp password)
  await client.send(
    new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: ADMIN_EMAIL,
      TemporaryPassword: ADMIN_TEMP_PASSWORD,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: ADMIN_EMAIL },
        { Name: 'email_verified', Value: 'true' },
      ],
    })
  );

  // Set a permanent password so the user doesn't need to reset on first login
  await client.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: ADMIN_EMAIL,
      Password: ADMIN_TEMP_PASSWORD,
      Permanent: true,
    })
  );

  console.log(`  created — ${ADMIN_EMAIL}`);
  console.log(`\nDone. Use these credentials to log in to the admin panel.`);
  console.log(`Remember to change the password after the first login.\n`);
}

createAdmin().catch((err: unknown) => {
  console.error('create-admin failed:', err);
  process.exit(1);
});
