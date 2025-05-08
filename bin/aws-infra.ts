#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { AwsInfraStack } from '../lib/aws-infra-stack';

const app = new App();
new AwsInfraStack(app, 'AwsInfraStack');
