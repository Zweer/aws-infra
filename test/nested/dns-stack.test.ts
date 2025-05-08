import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { DnsStack } from '../../lib/nested/dns-stack';

describe('dns stack', () => {
  let parentStack: Stack;
  let dnsStack: DnsStack;

  beforeEach(() => {
    const app = new App();
    parentStack = new Stack(app, 'ParentStack');
    dnsStack = new DnsStack(parentStack, 'DnsStack');
  });

  it('should contain a hosted zone', () => {
    const template = Template.fromStack(dnsStack);

    template.hasResourceProperties('AWS::Route53::HostedZone', {
      Name: 'olivieriachille.com.',
    });

    template.resourceCountIs('AWS::Route53::HostedZone', 1);
    template.resourceCountIs('AWS::Route53::RecordSet', 8);
  });

  it('should create Pidgey records', () => {
    const template = Template.fromStack(dnsStack);

    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'pidgey.olivieriachille.com.',
      Type: 'A',
      ResourceRecords: ['192.243.102.171'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'valvometal.olivieriachille.com.',
      Type: 'A',
      ResourceRecords: ['192.243.102.171'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
  });

  it('should create Mailtrap records', () => {
    const template = Template.fromStack(dnsStack);

    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'mt-link.olivieriachille.com.',
      Type: 'CNAME',
      ResourceRecords: ['t.mailtrap.live.'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'mt81.olivieriachille.com.',
      Type: 'CNAME',
      ResourceRecords: ['smtp.mailtrap.live.'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'rwmt1._domainkey.olivieriachille.com.',
      Type: 'CNAME',
      ResourceRecords: ['rwmt1.dkim.smtp.mailtrap.live.'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'rwmt2._domainkey.olivieriachille.com.',
      Type: 'CNAME',
      ResourceRecords: ['rwmt2.dkim.smtp.mailtrap.live.'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: '_dmarc.olivieriachille.com.',
      Type: 'TXT',
      ResourceRecords: ['"v=DMARC1; p=none; rua=mailto:dmarc@smtp.mailtrap.live; ruf=mailto:dmarc@smtp.mailtrap.live; rf=afrf; pct=100"'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
  });

  it('should create Gmail records', () => {
    const template = Template.fromStack(dnsStack);

    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: '@.olivieriachille.com.',
      Type: 'TXT',
      ResourceRecords: ['"google-site-verification=DPYOrFEMvRGSMbG3JSqO96UKYJ2qUVQu_K_MTmlOaAw"'],
      TTL: '1800',
      HostedZoneId: {
        Ref: 'HostedZoneDB99F866',
      },
    });
  });
});
