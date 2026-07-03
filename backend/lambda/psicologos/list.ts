import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { docClient, TABLE_NAME } from '../shared/db';
import { ok, internalError } from '../shared/response';
import type { Psicologo, ListPsicologosResponse } from '../shared/types';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const params = event.queryStringParameters ?? {};
  console.log('list psicologos', { params });

  try {
    const start = Date.now();
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'aceptaDirectorio = :activo AND estadoVerificacion = :aprobado',
        ExpressionAttributeValues: { ':activo': true, ':aprobado': 'APPROVED' },
      })
    );
    console.log('DynamoDB scan', { ms: Date.now() - start, count: result.Count });

    let items = (result.Items ?? []) as Psicologo[];

    // In-memory filtering — suitable for MVP with <1000 records.
    // Migrate to GSI Query when volume grows.
    if (params.especialidad) {
      items = items.filter((p) => p.especialidad === params.especialidad);
    }
    if (params.modalidad) {
      items = items.filter((p) => p.modalidad === params.modalidad);
    }
    if (params.pais) {
      items = items.filter((p) => p.pais === params.pais);
    }
    if (params.idioma) {
      items = items.filter((p) => p.idiomas.includes(params.idioma!));
    }
    if (params.q) {
      const term = params.q.toLowerCase();
      items = items.filter(
        (p) =>
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(term) ||
          p.especialidad.toLowerCase().includes(term) ||
          p.ciudad.toLowerCase().includes(term) ||
          p.pais.toLowerCase().includes(term) ||
          p.biografia.toLowerCase().includes(term)
      );
    }

    items.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));

    const itemsFiltrados = items.map((p) => {
      const { credencialUrl, email, ...resto } = p;
      return resto; 
    });

    const response: ListPsicologosResponse = { 
      items: itemsFiltrados, 
      count: itemsFiltrados.length 
    };
    
    return ok(response);
  } catch (err) {
    console.error('Error listing psicologos', err);
    return internalError();
  }
}
