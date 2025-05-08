import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { AwsInfraStack } from '../lib/aws-infra-stack';

describe('aws infra stack', () => {
  it('should match snapshot', () => {
    const app = new App();
    const stack = new AwsInfraStack(app, 'AwsInfraStack');

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
