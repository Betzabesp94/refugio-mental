import { GetCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { ok, notFound, badRequest, internalError } from '../shared/response';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  console.log('get psicologo', { id });

  if (!id) return badRequest('ID requerido.');

  try {
    const start = Date.now();
    const result = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    console.log('DynamoDB get', { ms: Date.now() - start, found: !!result.Item });

    if (!result.Item) return notFound();

    const { 
      credencialUrl,  
      email, 
      ...psicologoFiltrado 
    } = result.Item;

    return ok(psicologoFiltrado);
    
  } catch (err) {
    console.error('Error getting psicologo', err);
    return internalError();
  }
}
