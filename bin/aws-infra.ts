import { App } from 'aws-cdk-lib';

import { AwsInfraStack } from '../lib/aws-infra-stack.js';

const app = new App();
new AwsInfraStack(app, 'AwsInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION,
  },
});
