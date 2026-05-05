import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe, expect, it } from 'vitest';

import { DnsStack } from '../../lib/nested/dns-stack.js';

describe('DnsStack', () => {
  it('should have the correct zone name', () => {
    expect(DnsStack.ZONE_NAME).toBe('olivieriachille.com');
  });

  it('should create hosted zone and records', () => {
    const app = new App();
    const parentStack = new Stack(app, 'ParentStack');
    const dnsStack = new DnsStack(parentStack, 'DnsStack');
    const template = Template.fromStack(dnsStack);

    template.resourceCountIs('AWS::Route53::HostedZone', 1);
    template.resourceCountIs('AWS::Route53::RecordSet', 8);
  });
});
