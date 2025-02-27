import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { Lambda } from "../resources/lambda";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Lambda(this);
  }
}
