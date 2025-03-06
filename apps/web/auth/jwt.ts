import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

export const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export type JwtPayloadType = CognitoIdTokenPayload;