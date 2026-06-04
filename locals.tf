locals {
  tags = {
    project     = "Demo Terraform AWS IAM Integration"
    description = "To demonstrate how to integrate AWS IAM with Terraform for a Lambda function"
    environment = terraform.workspace
    application = var.app
  }
}