#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RefugioMentalStack } from '../lib/stacks/refugio-mental-stack';

const app = new cdk.App();

new RefugioMentalStack(app, 'RefugioMentalStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'Refugio Mental — Serverless backend for psychologist directory (24J Venezuela)',
});

app.synth();
