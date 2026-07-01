import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { ok, badRequest, notFound, internalError } from '../shared/response';
import { validatePsicologo } from '../shared/validate';
import type { Psicologo } from '../shared/types';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  console.log('update psicologo', { id });

  if (!id) return badRequest('ID requerido.');

  let body: Partial<Omit<Psicologo, 'id' | 'creadoEn'>>;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return badRequest('Cuerpo de la solicitud inválido. Se esperaba JSON.');
  }

  const { valid, fields } = validatePsicologo(body);
  if (!valid) return badRequest('Datos de entrada inválidos.', fields);

  try {
    const existing = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    if (!existing.Item) return notFound();

    const updated: Psicologo = {
      ...(existing.Item as Psicologo),
      nombre: body.nombre!.trim(),
      apellido: body.apellido!.trim(),
      fotografia: body.fotografia?.trim() ?? '',
      especialidad: body.especialidad!.trim(),
      ciudad: body.ciudad!.trim(),
      pais: body.pais!.trim(),
      idiomas: body.idiomas!,
      modalidad: body.modalidad!,
      biografia: body.biografia!.trim(),
      calendlyUrl: body.calendlyUrl!.trim(),
      email: body.email?.trim() || undefined,
      redesSociales: (body.redesSociales ?? []).filter(
        (r) => r.plataforma?.trim() && r.url?.trim()
      ),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: updated }));
    console.log('DynamoDB update', { id });
    return ok(updated);
  } catch (err) {
    console.error('Error updating psicologo', err);
    return internalError();
  }
}
