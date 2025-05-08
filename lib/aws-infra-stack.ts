import type { StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { Stack } from 'aws-cdk-lib';

import { DnsStack } from './nested/dns-stack';

export class AwsInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new DnsStack(this, 'DnsStack');
  }
}
