import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoConstruct extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly client: cognito.UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, 'AdminUserPool', {
      userPoolName: 'refugio-mental-admins',
      // Admins are created manually via the create-admin script — no self sign-up
      selfSignUpEnabled: false,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      // RETAIN to avoid losing admin accounts on stack updates
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.client = this.userPool.addClient('AdminWebClient', {
      userPoolClientName: 'refugio-mental-admin-web',
      authFlows: {
        // SRP is the secure default; USER_PASSWORD_AUTH is needed for the SDK
        userSrp: true,
        userPassword: true,
      },
      // Short token validity for admin sessions
      accessTokenValidity: cdk.Duration.hours(8),
      idTokenValidity: cdk.Duration.hours(8),
      refreshTokenValidity: cdk.Duration.days(1),
      preventUserExistenceErrors: true,
    });
  }
}
