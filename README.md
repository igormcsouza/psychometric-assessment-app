# Psychometric Assessment App

## Run with Docker

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:3033
- Backend: http://localhost:8033

## OpenAI insights

Create a root `.env` file from `.env.example` and add your `OPENAI_API_KEY` to enable AI-powered personality insights on the backend.

## AWS backend (on demand)

The backend (Lambda + public Function URL, `sa-east-1`) only exists while you need it. It is defined in [`infra/backend.yaml`](infra/backend.yaml) and managed by the manual workflow `AWS backend` (`.github/workflows/aws-backend.yml`).

- **Deploy:** GitHub → Actions → *AWS backend* → *Run workflow* → `action: deploy`. The Function URL is in the job summary. Point the frontend at it.
- **Destroy:** same workflow, `action: destroy`. Deletes the stack (Lambda, role, log group, URL) and fails if anything is left.

### One-time setup

Repo secrets: `AWS_ROLE_ARN` (role below), `OPENAI_API_KEY`. Optional repo variables: `OPENAI_MODEL` (default `gpt-5.5`), `OPENAI_TIMEOUT_SECONDS` (default `15`).

IAM role (account `693473496042`) with OIDC trust for `token.actions.githubusercontent.com` (audience `sts.amazonaws.com`, `sub` = `repo:igormcsouza/psychometric-assessment-app:ref:refs/heads/main`; use a different ref if you run it from another branch). Permissions, scoped to this stack:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "cloudformation:*",
      "Resource": "arn:aws:cloudformation:sa-east-1:693473496042:stack/psychometric-assessment-backend/*" },
    { "Effect": "Allow", "Action": "cloudformation:GetTemplateSummary", "Resource": "*" },
    { "Effect": "Allow",
      "Action": ["lambda:CreateFunction", "lambda:DeleteFunction", "lambda:GetFunction", "lambda:GetFunctionConfiguration",
                 "lambda:UpdateFunctionCode", "lambda:UpdateFunctionConfiguration", "lambda:TagResource", "lambda:UntagResource",
                 "lambda:ListTags", "lambda:CreateFunctionUrlConfig", "lambda:DeleteFunctionUrlConfig",
                 "lambda:GetFunctionUrlConfig", "lambda:UpdateFunctionUrlConfig", "lambda:AddPermission",
                 "lambda:RemovePermission", "lambda:GetPolicy"],
      "Resource": "arn:aws:lambda:sa-east-1:693473496042:function:psychometric-assessment-backend" },
    { "Effect": "Allow",
      "Action": ["logs:CreateLogGroup", "logs:DeleteLogGroup", "logs:PutRetentionPolicy", "logs:TagResource", "logs:UntagResource", "logs:ListTagsForResource"],
      "Resource": "arn:aws:logs:sa-east-1:693473496042:log-group:/aws/lambda/psychometric-assessment-backend*" },
    { "Effect": "Allow", "Action": "logs:DescribeLogGroups", "Resource": "*" },
    { "Effect": "Allow",
      "Action": ["iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:PassRole", "iam:PutRolePolicy", "iam:DeleteRolePolicy",
                 "iam:GetRolePolicy", "iam:TagRole", "iam:UntagRole"],
      "Resource": "arn:aws:iam::693473496042:role/psychometric-assessment-backend-*" }
  ]
}
```
