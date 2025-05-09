import type { NestedStackProps, Stack } from 'aws-cdk-lib';
import type { IPublicHostedZone } from 'aws-cdk-lib/aws-route53';
import type { Construct } from 'constructs';

import { NestedStack } from 'aws-cdk-lib';
import { ARecord, CnameRecord, PublicHostedZone, RecordTarget, TxtRecord } from 'aws-cdk-lib/aws-route53';
import { pascalCase } from 'change-case';

export class DnsStack extends NestedStack {
  static readonly ZONE_NAME = 'olivieriachille.com';

  static retrieveHostedZone(stack: Stack): IPublicHostedZone {
    return PublicHostedZone.fromLookup(stack, 'HostedZone', {
      domainName: DnsStack.ZONE_NAME,
    });
  }

  readonly hostedZone: PublicHostedZone;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: DnsStack.ZONE_NAME,
    });

    this.createPidgeyRecords();
    this.createMailtrapRecords();
    this.createGmailRecords();
  }

  protected createPidgeyRecords() {
    const target = RecordTarget.fromIpAddresses('192.243.102.171');

    this.createARecords('Pidgey', [{
      recordName: 'pidgey',
      target,
    }, {
      recordName: 'valvometal',
      target,
    }]);
  }

  protected createMailtrapRecords() {
    this.createCnames('Mailtrap', [{
      recordName: 'mt-link',
      domainName: 't.mailtrap.live.',
    }, {
      recordName: 'mt81',
      domainName: 'smtp.mailtrap.live.',
    }, {
      recordName: 'rwmt1._domainkey',
      domainName: 'rwmt1.dkim.smtp.mailtrap.live.',
    }, {
      recordName: 'rwmt2._domainkey',
      domainName: 'rwmt2.dkim.smtp.mailtrap.live.',
    }]);

    this.createTxtRecords('Mailtrap', [{
      recordName: '_dmarc',
      value: 'v=DMARC1; p=none; rua=mailto:dmarc@smtp.mailtrap.live; ruf=mailto:dmarc@smtp.mailtrap.live; rf=afrf; pct=100',
    }]);
  }

  protected createGmailRecords() {
    this.createTxtRecords('Gmail', [{
      recordName: '@',
      value: 'google-site-verification=DPYOrFEMvRGSMbG3JSqO96UKYJ2qUVQu_K_MTmlOaAw',
    }]);
  }

  protected createARecords(subject: string, records: { recordName: string; target: RecordTarget }[]) {
    records.forEach(({ recordName, target }) => {
      new ARecord(this, `${pascalCase(subject)}${pascalCase(recordName)}ARecord`, {
        zone: this.hostedZone,
        recordName,
        target,
      });
    });
  }

  protected createCnames(subject: string, records: { recordName: string; domainName: string }[]) {
    records.forEach(({ recordName, domainName }) => {
      new CnameRecord(this, `${pascalCase(subject)}${pascalCase(recordName)}CnameRecord`, {
        zone: this.hostedZone,
        recordName,
        domainName,
      });
    });
  }

  protected createTxtRecords(subject: string, records: { recordName: string; value: string }[]) {
    records.forEach(({ recordName, value }) => {
      new TxtRecord(this, `${pascalCase(subject)}${pascalCase(recordName)}TxtRecord`, {
        zone: this.hostedZone,
        recordName,
        values: [value],
      });
    });
  }
}
