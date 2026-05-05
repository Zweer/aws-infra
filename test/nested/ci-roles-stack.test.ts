import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe, it } from 'vitest';

import { CiRolesStack } from '../../lib/nested/ci-roles-stack.js';

describe('CiRolesStack', () => {
  it('should create OIDC provider and roles for each repo', () => {
    const app = new App();
    const parentStack = new Stack(app, 'ParentStack');
    const ciStack = new CiRolesStack(parentStack, 'CiRolesStack');
    const template = Template.fromStack(ciStack);

    template.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1);
    // 2 CI roles + 1 custom resource role for OIDC provider
    template.resourceCountIs('AWS::IAM::Role', 3);
  });
});
