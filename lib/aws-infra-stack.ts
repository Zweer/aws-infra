import { Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { CiRolesStack } from './nested/ci-roles-stack.js';
import { DnsStack } from './nested/dns-stack.js';

export class AwsInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new DnsStack(this, 'DnsStack');
    new CiRolesStack(this, 'CiRolesStack');
  }
}
