import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { Cognito } from "../resources/cognito";

export class AuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Cognito(this);
  }
}
