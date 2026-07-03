import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { LambdaHandlers } from './lambda-construct';

interface ApiConstructProps {
  handlers: LambdaHandlers;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
}

export class ApiConstruct extends Construct {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    const { handlers, userPool, userPoolClient } = props;

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: 'refugio-mental-api',
      description: 'Refugio Mental — Psychologist directory API',
      corsPreflight: {
        allowOrigins: [
          'https://refugio-mental.vercel.app',
          'http://localhost:3000',
          'http://localhost:3001',
        ],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: cdk.Duration.days(1),
      },
    });

    // JWT Authorizer backed by Cognito User Pool — used for admin-only routes
    const adminAuthorizer = new HttpJwtAuthorizer(
      'AdminAuthorizer',
      userPool.userPoolProviderUrl,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      }
    );

    // --- Public routes (no auth required) ---

    // GET /v1/psicologos — list profiles with optional filters
    this.httpApi.addRoutes({
      path: '/v1/psicologos',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('ListIntegration', handlers.list),
    });

    // POST /v1/psicologos — register new profile
    this.httpApi.addRoutes({
      path: '/v1/psicologos',
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('CreateIntegration', handlers.create),
    });

    // GET /v1/psicologos/{id} — get single profile
    this.httpApi.addRoutes({
      path: '/v1/psicologos/{id}',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetIntegration', handlers.get),
    });

    // --- Admin routes (JWT required) ---

    // GET /v1/admin/psicologos — list ALL profiles regardless of estadoVerificacion (admin only)
    this.httpApi.addRoutes({
      path: '/v1/admin/psicologos',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('ListAdminIntegration', handlers.listAdmin),
      authorizer: adminAuthorizer,
    });

    // DELETE /v1/psicologos/{id} — remove profile (admin only)
    this.httpApi.addRoutes({
      path: '/v1/psicologos/{id}',
      methods: [apigwv2.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('DeleteIntegration', handlers.remove),
      authorizer: adminAuthorizer,
    });

    // PUT /v1/psicologos/{id} — update profile (admin only)
    this.httpApi.addRoutes({
      path: '/v1/psicologos/{id}',
      methods: [apigwv2.HttpMethod.PUT],
      integration: new HttpLambdaIntegration('UpdateIntegration', handlers.update),
      authorizer: adminAuthorizer,
    });

    // PATCH /v1/psicologos/{id} — verify profile status (admin only)
    this.httpApi.addRoutes({
      path: '/v1/psicologos/{id}',
      methods: [apigwv2.HttpMethod.PATCH],
      integration: new HttpLambdaIntegration('VerifyIntegration', handlers.verify),
      authorizer: adminAuthorizer,
    });
  }
}
