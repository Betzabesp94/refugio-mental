import { DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { noContent, badRequest, notFound, internalError } from '../shared/response';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  console.log('delete psicologo', { id });

  if (!id) return badRequest('ID requerido.');

  try {
    const existing = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    if (!existing.Item) return notFound();

    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    console.log('DynamoDB delete', { id });
    return noContent();
  } catch (err) {
    console.error('Error deleting psicologo', err);
    return internalError();
  }
}
