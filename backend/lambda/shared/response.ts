import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const headers = {
  'Content-Type': 'application/json',
};

export function ok(body: unknown): APIGatewayProxyResultV2 {
  return { statusCode: 200, headers, body: JSON.stringify(body) };
}

export function created(body: unknown): APIGatewayProxyResultV2 {
  return { statusCode: 201, headers, body: JSON.stringify(body) };
}

export function noContent(): APIGatewayProxyResultV2 {
  return { statusCode: 204, headers, body: '' };
}

export function badRequest(
  error: string,
  fields?: Record<string, string>
): APIGatewayProxyResultV2 {
  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error, ...(fields && { fields }) }),
  };
}

export function notFound(message = 'Perfil no encontrado'): APIGatewayProxyResultV2 {
  return { statusCode: 404, headers, body: JSON.stringify({ error: message }) };
}

export function internalError(message = 'Error interno del servidor'): APIGatewayProxyResultV2 {
  return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
}
