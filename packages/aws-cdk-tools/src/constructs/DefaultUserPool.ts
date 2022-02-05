import { Aws } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class DefualtUserPool extends UserPool {
  public readonly config: {
    userPool: {
      id: string;
      arn: string;
      region: string;
      client: {
        id: string;
        url: string;
        signinUrl: string;
      };
    };
  };

  constructor(
    scope: Construct,
    id: string,
    props: {
      domainPrefix: string;
      callbackUrls: string[];
      redirectUrl: string;
    }
  ) {
    super(scope, id, {
      selfSignUpEnabled: true,
      signInAliases: {
        username: false,
        email: true,
        phone: false,
        preferredUsername: false,
      },
      autoVerify: {
        email: true,
      },
    });

    const client = this.addClient("UserPoolClient", {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: props.callbackUrls,
      },
    });

    const domain = this.addDomain("UserPoolDomain", {
      cognitoDomain: {
        domainPrefix: props.domainPrefix,
      },
    });

    this.config = {
      userPool: {
        arn: this.userPoolArn,
        id: this.userPoolId,
        region: Aws.REGION,
        client: {
          id: client.userPoolClientId,
          url: domain.baseUrl(),
          signinUrl: domain.signInUrl(client, {
            redirectUri: props.redirectUrl,
          }),
        },
      },
    };
  }
}
