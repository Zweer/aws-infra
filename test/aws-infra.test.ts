import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe, it } from 'vitest';

import { AwsInfraStack } from '../lib/aws-infra-stack.js';

describe('AwsInfraStack', () => {
  it('should create DNS and CI roles nested stacks', () => {
    const app = new App();
    const stack = new AwsInfraStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::CloudFormation::Stack', 2);
  });
});
