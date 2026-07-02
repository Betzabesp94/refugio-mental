import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DatabaseConstruct } from '../constructs/database-construct';
import { LambdaConstruct } from '../constructs/lambda-construct';
import { ApiConstruct } from '../constructs/api-construct';
import { CognitoConstruct } from '../constructs/cognito-construct';

export class RefugioMentalStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const db = new DatabaseConstruct(this, 'Database');
    const cognito = new CognitoConstruct(this, 'Cognito');

    const lambdas = new LambdaConstruct(this, 'Lambda', {
      table: db.table,
    });

    const api = new ApiConstruct(this, 'Api', {
      handlers: lambdas.handlers,
      userPool: cognito.userPool,
      userPoolClient: cognito.client,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.httpApi.apiEndpoint,
      description: 'API Gateway HTTP API endpoint — set as NEXT_PUBLIC_API_URL in Vercel',
      exportName: 'RefugioMentalApiUrl',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: db.table.tableName,
      description: 'DynamoDB table name — set as TABLE_NAME when running seed script',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: cognito.userPool.userPoolId,
      description: 'Cognito User Pool ID — set as NEXT_PUBLIC_COGNITO_USER_POOL_ID in Vercel',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: cognito.client.userPoolClientId,
      description: 'Cognito App Client ID — set as NEXT_PUBLIC_COGNITO_CLIENT_ID in Vercel',
    });
  }
}
