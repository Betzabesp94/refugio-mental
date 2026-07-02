import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const TOKEN_KEY = 'refugio_admin_id_token';

function getUserPool(): CognitoUserPool {
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  if (!userPoolId || !clientId) {
    throw new Error(
      'Missing Cognito env vars. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID.'
    );
  }

  return new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
}

export function signIn(email: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pool = getUserPool();
    const user = new CognitoUser({ Username: email, Pool: pool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess(session: CognitoUserSession) {
        const idToken = session.getIdToken().getJwtToken();
        sessionStorage.setItem(TOKEN_KEY, idToken);
        resolve(idToken);
      },
      onFailure(err: Error) {
        reject(err);
      },
      newPasswordRequired(_userAttributes, _requiredAttributes) {
        reject(new Error('PASSWORD_RESET_REQUIRED'));
      },
    });
  });
}

export function signOut(): void {
  try {
    const pool = getUserPool();
    const user = pool.getCurrentUser();
    user?.signOut();
  } catch {
    // pool may not be configured; clear storage regardless
  } finally {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
