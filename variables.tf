
// variables file for AWS region configuration

variable "region" {
  type    = string
  default = "eu-west-2"
}

variable "app" {
  description = "Enter the name of the app (lower case characters only)"
  default = "Demo"
}