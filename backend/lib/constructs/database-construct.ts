import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseConstruct extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'PsicologosTable', {
      tableName: 'refugio-mental-psicologos',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // RETAIN prevents accidental data loss on stack update/destroy
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: filter by country, sorted chronologically
    this.table.addGlobalSecondaryIndex({
      indexName: 'pais-creadoEn-index',
      partitionKey: { name: 'pais', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'creadoEn', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: filter by specialty, sorted chronologically
    this.table.addGlobalSecondaryIndex({
      indexName: 'especialidad-creadoEn-index',
      partitionKey: { name: 'especialidad', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'creadoEn', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: filter by modality, sorted chronologically
    this.table.addGlobalSecondaryIndex({
      indexName: 'modalidad-creadoEn-index',
      partitionKey: { name: 'modalidad', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'creadoEn', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
