# AWS Terraform IAM Integration

This project demonstrates AWS Lambda integration with Terraform for infrastructure as code, including GitHub OIDC provider role setup for secure CI/CD deployments.

## Project Structure

```
.
├── lamdda.tf              # Lambda function Terraform configuration
├── providers.tf           # AWS provider and Terraform settings
├── variables.tf           # Terraform variables
├── lambda/
│   └── index.js          # Lambda function handler code
└── policies/
    ├── iam-github-oidc-provider-role.json      # GitHub OIDC trust policy
    ├── terraform-aws-tfstate-policy.json       # Terraform state management policy
    └── terraform-lamda-policy.json             # Lambda execution policy
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

1. **GitHub OIDC Provider Role** (`iam-github-oidc-provider-role.json`)
   - Enables GitHub Actions to authenticate using OpenID Connect
   - Allows secure deployments without static credentials

2. **Terraform State Policy** (`terraform-aws-tfstate-policy.json`)
   - Manages permissions for Terraform state storage
   - Typically used for S3 bucket access

3. **Lambda Execution Policy** (`terraform-lamda-policy.json`)
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

## Testing

### Health Check
```bash
curl https://<api-gateway-url>/health
```

### Default Endpoint
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

## Notes

- The file name `lamdda.tf` appears to be a typo (should be `lambda.tf`)
- Consider using environment variables for sensitive configuration in production
- Monitor Lambda execution logs in CloudWatch
