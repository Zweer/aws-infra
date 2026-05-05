import { CfnOutput, Duration, NestedStack, type NestedStackProps } from 'aws-cdk-lib';
/**
 * CI Roles for GitHub Actions via OIDC federation.
 *
 * Role names are deterministic: `{repo-name}-ci`
 * ARN pattern: arn:aws:iam::{ACCOUNT_ID}:role/{repo-name}-ci
 *
 * You can configure AWS_ROLE_ARN in GitHub secrets BEFORE deploying this stack.
 */
import {
  Effect,
  OpenIdConnectProvider,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';

interface RepoConfig {
  repo: string;
  permissions: string[];
}

const REPOS: RepoConfig[] = [
  {
    repo: 'Zweer/aws-infra',
    permissions: [
      'cloudformation:*',
      'ssm:GetParameter',
      'sts:AssumeRole',
      'iam:*',
      'route53:*',
      's3:*',
    ],
  },
  {
    repo: 'Zweer/kaze-no-manga',
    permissions: [
      'cloudformation:*',
      'ssm:GetParameter',
      'sts:AssumeRole',
      'iam:*',
      's3:*',
      'lambda:*',
      'dynamodb:*',
      'appsync:*',
      'cognito-idp:*',
      'cloudfront:*',
      'logs:*',
      'events:*',
      'sqs:*',
    ],
  },
];

export class CiRolesStack extends NestedStack {
  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    const oidcProvider = new OpenIdConnectProvider(this, 'GitHubOidc', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      // Required by CDK but ignored by AWS for GitHub Actions since 2023
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });

    for (const { repo, permissions } of REPOS) {
      const repoName = repo.split('/')[1] ?? repo;

      const role = new Role(this, `${repoName}Role`, {
        roleName: `${repoName}-ci`,
        maxSessionDuration: Duration.hours(1),
        assumedBy: new WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${repo}:*`,
          },
        }),
      });

      role.addToPolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: permissions,
          resources: ['*'],
        }),
      );

      new CfnOutput(this, `${repoName}RoleArn`, {
        value: role.roleArn,
        description: `CI role ARN for ${repo}`,
      });
    }
  }
}
