import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { created, badRequest, internalError } from '../shared/response';
import { validatePsicologo } from '../shared/validate';
import type { Psicologo } from '../shared/types';

function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `psi-${timestamp}-${random}`;
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.log('create psicologo');

  let body: Partial<Omit<Psicologo, 'id' | 'creadoEn'>>;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return badRequest('Cuerpo de la solicitud inválido. Se esperaba JSON.');
  }

  const { valid, fields } = validatePsicologo(body);
  if (!valid) return badRequest('Datos de entrada inválidos.', fields);

  const psicologo: Psicologo = {
    id: generateId(),
    nombre: body.nombre!.trim(),
    apellido: body.apellido!.trim(),
    fotografia: body.fotografia?.trim() ?? '',
    especialidad: body.especialidad!.trim(),
    credencialUrl: body.credencialUrl?.trim() ?? '',
    estadoVerificacion: 'PENDING',
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
    aceptaDirectorio: true,
    creadoEn: new Date().toISOString(),
  };

  try {
    const start = Date.now();
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: psicologo }));
    console.log('DynamoDB put', { ms: Date.now() - start, id: psicologo.id });
    return created(psicologo);
  } catch (err) {
    console.error('Error creating psicologo', err);
    return internalError();
  }
}
