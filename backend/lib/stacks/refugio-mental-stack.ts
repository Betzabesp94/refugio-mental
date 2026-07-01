import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DatabaseConstruct } from '../constructs/database-construct';
import { LambdaConstruct } from '../constructs/lambda-construct';
import { ApiConstruct } from '../constructs/api-construct';

export class RefugioMentalStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const db = new DatabaseConstruct(this, 'Database');

    const lambdas = new LambdaConstruct(this, 'Lambda', {
      table: db.table,
    });

    const api = new ApiConstruct(this, 'Api', {
      handlers: lambdas.handlers,
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
  }
}
