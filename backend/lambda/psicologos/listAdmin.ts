import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { ok, internalError } from '../shared/response';
import type { Psicologo, ListPsicologosResponse } from '../shared/types';

/**
 * Admin-only list handler — returns ALL profiles regardless of estadoVerificacion.
 * Protected by Cognito JWT Authorizer at the API Gateway level.
 */
export async function handler(_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log('list all psicologos (admin)');

  try {
    const start = Date.now();
    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    console.log('DynamoDB scan (admin)', { ms: Date.now() - start, count: result.Count });

    const items = (result.Items ?? []) as Psicologo[];
    items.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));

    const response: ListPsicologosResponse = { items, count: items.length };
    return ok(response);
  } catch (err) {
    console.error('Error listing all psicologos (admin)', err);
    return internalError();
  }
}
