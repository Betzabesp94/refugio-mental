/**
 * Seed script: populates DynamoDB with the initial set of fictional psychologist profiles.
 *
 * Run once after the first cdk deploy:
 *   TABLE_NAME=refugio-mental-psicologos AWS_REGION=us-east-1 npm run seed
 *
 * Profiles already present (by id) are skipped — safe to run multiple times.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Psicologo } from "../shared/types/psicologo";

const TABLE_NAME = process.env.TABLE_NAME ?? "refugio-mental-psicologos";
const REGION = process.env.AWS_REGION ?? "us-east-1";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const psicologosSeed: Psicologo[] = [
  {
    id: "seed-001",
    nombre: "John",
    apellido: "Doe",
    fotografia: "",
    especialidad: "Psicología",
    ciudad: "Caracas",
    pais: "Venezuela",
    idiomas: ["Español"],
    modalidad: "online",
    biografia:
      "Psicólogo clínico con 8 años de experiencia en intervención en crisis y atención a víctimas de desastres naturales. Especializado en técnicas de estabilización emocional y primeros auxilios psicológicos.",
    calendlyUrl: "https://calendly.com/ejemplo-john",
    redesSociales: [],
    aceptaDirectorio: true,
    creadoEn: "2026-06-24T12:00:00.000Z",
  },
];

async function seed(): Promise<void> {
  console.log(
    `\nSeeding ${psicologosSeed.length} profiles into: ${TABLE_NAME} (${REGION})\n`,
  );

  const existing = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME, ProjectionExpression: "id" }),
  );
  const existingIds = new Set(
    (existing.Items ?? []).map((i) => i.id as string),
  );

  let inserted = 0;
  let skipped = 0;

  for (const psicologo of psicologosSeed) {
    if (existingIds.has(psicologo.id)) {
      console.log(`  skip  ${psicologo.id} — already exists`);
      skipped++;
      continue;
    }

    await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: psicologo }),
    );
    console.log(
      `  added ${psicologo.id} — ${psicologo.nombre} ${psicologo.apellido}`,
    );
    inserted++;
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}\n`);
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
