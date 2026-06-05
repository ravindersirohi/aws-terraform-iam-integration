# AWS Terraform IAM Integration

This project demonstrates AWS Lambda integration with Terraform for infrastructure as code, including GitHub OIDC provider role setup for secure CI/CD deployments.

## Project Structure

```
.
├── lamdda.tf              # Lambda function Terraform configuration
├── providers.tf           # AWS provider and Terraform settings
├── variables.tf           # Terraform variables
├── lambda/
│   ├── index.js          # Lambda function handler code
└── policies/
    ├── iam-github-oidc-provider.json      # GitHub OIDC trust policy
    ├── terraform-aws-tfstate-policy.json  # Terraform state management policy
    └── terraform-policy.json              # Lambda execution policy
```

## Lambda Function

### Overview
The Lambda function provides two endpoints that only accept **GET** requests:

### Endpoints

#### 1. Health Check Endpoint
- **Path**: `/health`
- **Method**: GET
- **Description**: Returns the health status of the Lambda function
- **Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-04T12:00:00.000Z",
  "uptime": 1234.56
}
```

#### 2. Default Endpoint
- **Path**: Any other path
- **Method**: GET
- **Description**: Returns a greeting message
- **Response**:
```json
"Demo Lambda Function is running!"
```

### Error Responses

- **Method Not Allowed (405)**: Returned when a non-GET request is made to any endpoint
```json
{
  "error": "Method Not Allowed",
  "message": "Only GET requests are allowed"
}
```

## Terraform Configuration

### Files
- **lamdda.tf**: Defines the Lambda function resource, IAM role, and API Gateway configuration
- **providers.tf**: Configures the AWS provider and Terraform backend
- **variables.tf**: Defines input variables used across the configuration

### IAM Policies

1. **GitHub OIDC Provider Role** (`iam-github-oidc-provider.json`)
   - Enables GitHub Actions to authenticate using OpenID Connect
   - Allows secure deployments without static credentials

2. **Terraform State Policy** (`terraform-aws-tfstate-policy.json`)
   - Manages permissions for Terraform state storage
   - Typically used for S3 bucket access

3. **Lambda Execution Policy** (`terraform-policy.json`)
   - Defines permissions required by the Lambda function at runtime

## Getting Started

### Prerequisites
- Terraform >= 1.0
- AWS CLI configured with credentials
- GitHub repository with Actions enabled (for OIDC setup)

### Deployment

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Review the plan:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

### Integration Testing

#### Health Check
```bash
curl https://<api-gateway-url>/health
```

#### Default Endpoint
```bash
curl https://<api-gateway-url>/
```

## Security

### Lambda Security via AWS IAM
- **Execution Role**: Lambda runs with a dedicated IAM role that grants only necessary permissions
- **Resource-Based Policies**: Control who can invoke the Lambda function
- **Least Privilege**: Lambda role is configured with minimal permissions required for operation
- **No Public Access**: Lambda is only accessible through API Gateway with defined access controls

### Additional Security Measures
- Only GET requests are allowed on all endpoints
- GitHub OIDC provider enables secure CI/CD without long-lived credentials
- IAM roles and policies are managed through Terraform for version control and auditability
- All AWS API calls are logged and can be monitored via CloudTrail

## GitHub Actions Secrets Configuration

The CI/CD workflow in `.github/workflows/main.yml` requires the following secrets to be configured in your GitHub repository:

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_REGION` | AWS region where resources are deployed | `us-east-1` |
| `AWS_ROLE` | ARN of the IAM role for GitHub OIDC authentication | `arn:aws:iam::123456789012:role/github-oidc-role` |
| `AWS_BUCKET_NAME` | S3 bucket name for Terraform state storage | `my-terraform-state-bucket` |
| `AWS_BUCKET_KEY_NAME` | S3 object key path for Terraform state file | `terraform/repository-name.tfstate` |

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value
5. Click **Add secret** to save

### GitHub OIDC Setup

For the workflow to authenticate with AWS using GitHub OIDC:

1. Create an IAM OIDC identity provider in your AWS account
2. Create an IAM role with trust policy for GitHub (see `policies/iam-github-oidc-provider.json`)
3. Attach appropriate policies to the role (see `policies/terraform-*-policy.json`)
4. Set the `AWS_ROLE` secret to the ARN of this role

### Workflow Behavior

- **Pull Requests**: Runs `terraform plan` and comments the plan output on the PR
- **Pushes to master**: Runs `terraform plan` and automatically applies changes
- **Other branches**: No deployment occurs

## Notes

- Consider using environment variables for sensitive configuration in production
- Monitor Lambda execution logs in CloudWatch
- Ensure the S3 bucket for Terraform state is versioned and has encryption enabled
- Use IAM role assumption for AWS authentication instead of static credentials
