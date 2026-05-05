# @zweer/aws-infra

Shared AWS infrastructure managed via CDK (TypeScript).

## What it manages

- **DNS** — Route53 hosted zone and records for `olivieriachille.com`
- **CI Roles** — OIDC + IAM roles for GitHub Actions (no static access keys)

## Architecture

```
bin/               CDK app entrypoint
lib/
├── aws-infra-stack.ts       Root stack
└── nested/
    ├── dns-stack.ts         Route53 DNS
    └── ci-roles-stack.ts    GitHub Actions OIDC roles
test/              Vitest tests mirroring lib/ structure
```

Nested stacks are used for logical grouping. CI roles are array-driven — one role per repo with scoped permissions.

## Prerequisites

- Node.js >= 22
- AWS credentials configured (`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`)

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript (`tsc --build`) |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Lint & format check (Biome + lockfile-lint + typecheck) |
| `npm run fix` | Auto-fix lint/format issues |
| `npm run deploy` | Deploy all stacks (`cdk deploy --all`) |
| `npm run synth` | Synthesize CloudFormation templates |
| `npm run diff` | Compare deployed stack with current state |

## Tooling

- **TypeScript** strict mode, ES modules
- **Biome** for linting and formatting
- **Lefthook** + **Commitlint** for git hooks and conventional commits
- **tsx** as CDK app runner
