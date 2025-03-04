import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class Cognito {
  constructor(scope: Construct) {
    // Cognitoユーザープールの作成
    const userPool = new cognito.UserPool(scope, "UserPool", {
      userPoolName: "user-pool",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用、本番環境ではRETAINに変更する
    });

    // Google IDプロバイダーの設定
    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(scope, "GoogleProvider", {
      userPool: userPool,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["profile", "email", "openid"],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
      },
    });

    // アプリクライアントの作成
    const userPoolClient = new cognito.UserPoolClient(scope, "UserPoolClient", {
      userPool: userPool,
      generateSecret: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
        adminUserPassword: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
      oAuth: {
        callbackUrls: [process.env.AUTH_CALLBACK_URL!],
        logoutUrls: [process.env.AUTH_LOGOUT_URL!],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
          cognito.OAuthScope.COGNITO_ADMIN,
        ],
      },
    });

    // アプリクライアントはIDプロバイダーの設定後に作成する必要がある
    userPoolClient.node.addDependency(googleProvider);

    // Cognitoドメインプレフィックスの設定
    new cognito.UserPoolDomain(scope, "UserPoolDomain", {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: process.env.COGNITO_DOMAIN!,
      },
    });
  } 
}