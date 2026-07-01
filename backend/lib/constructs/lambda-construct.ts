import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

interface LambdaConstructProps {
  table: dynamodb.Table;
}

export interface LambdaHandlers {
  list: NodejsFunction;
  get: NodejsFunction;
  create: NodejsFunction;
  update: NodejsFunction;
  remove: NodejsFunction;
}

export class LambdaConstruct extends Construct {
  public readonly handlers: LambdaHandlers;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const { table } = props;

    const commonEnv: Record<string, string> = {
      TABLE_NAME: table.tableName,
      NODE_OPTIONS: '--enable-source-maps',
    };

    const lambdaDir = path.join(__dirname, '../../lambda/psicologos');

    const createFn = (name: string, entry: string): NodejsFunction => {
      return new NodejsFunction(scope, name, {
        entry: path.join(lambdaDir, entry),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(10),
        environment: commonEnv,
        bundling: {
          minify: true,
          sourceMap: true,
          target: 'es2022',
          // Exclude AWS SDK v3 — provided by the Lambda runtime
          externalModules: ['@aws-sdk/*'],
        },
      });
    };

    this.handlers = {
      list: createFn('ListPsicologos', 'list.ts'),
      get: createFn('GetPsicologo', 'get.ts'),
      create: createFn('CreatePsicologo', 'create.ts'),
      update: createFn('UpdatePsicologo', 'update.ts'),
      remove: createFn('DeletePsicologo', 'delete.ts'),
    };

    // Minimal IAM permissions per function
    table.grantReadData(this.handlers.list);
    table.grantReadData(this.handlers.get);
    table.grantWriteData(this.handlers.create);
    table.grantReadWriteData(this.handlers.update);
    table.grantReadWriteData(this.handlers.remove);
  }
}
