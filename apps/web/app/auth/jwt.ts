import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

export const jwtVerifier = async (id_token: string) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    tokenUse: "id",
    clientId: process.env.COGNITO_CLIENT_ID!,
  });

  await verifier.hydrate();
  return await (verifier.verify(id_token)) as JwtPayloadType
}

export type JwtPayloadType = {
  email: string;
  "cognito:username": string;
  picture?: string;
} & CognitoIdTokenPayload;

export type TokensType = {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}