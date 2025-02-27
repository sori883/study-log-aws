import type { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dockerPath = path.join(__dirname, "../../../");

export class Lambda {
  constructor(scope: Construct) {

    // lambda
    const remixLambda = new lambda.DockerImageFunction(scope, "RemixFunction", {
      code: lambda.DockerImageCode.fromImageAsset(dockerPath, {}),
    });
    
    // api gateway
    new apigw.LambdaRestApi(scope, "RemixApi", {
      handler: remixLambda,
      binaryMediaTypes: ["*/*"],
      deployOptions: {
        stageName: "prod",
        cachingEnabled: true,
      },
    });

  } 
}