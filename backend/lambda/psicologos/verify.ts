import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { ok, badRequest, internalError } from '../shared/response';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  console.log('update estado psicologo', { id });

  if (!id) return badRequest('ID requerido.');

  let body: { estadoVerificacion?: string };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return badRequest('Cuerpo de la solicitud inválido. Se esperaba JSON.');
  }

  const nuevoEstado = body.estadoVerificacion;
  if (nuevoEstado !== 'APPROVED' && nuevoEstado !== 'REJECTED') {
    return badRequest('Estado de verificación inválido.');
  }

  try {
    const start = Date.now();
    // UpdateCommand es ideal porque solo toca la columna específica sin pedir toda la data
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set estadoVerificacion = :estado',
        ExpressionAttributeValues: {
          ':estado': nuevoEstado,
        },
      })
    );
    
    console.log('DynamoDB update estado', { ms: Date.now() - start, id, nuevoEstado });
    return ok({ message: 'Estado actualizado correctamente' });
  } catch (err) {
    console.error('Error updating estado psicologo', err);
    return internalError();
  }
}