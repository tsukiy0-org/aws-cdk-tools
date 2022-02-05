import { DefaultTable, DefualtUserPool } from "@tsukiy0/aws-cdk-tools";
import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class ExternalStack extends Stack {
  public constructor(
    scope: Construct,
    id: string,
    props: StackProps & {
      tableName: string;
    }
  ) {
    super(scope, id, props);

    new DefaultTable(this, "Table", {
      tableName: props.tableName,
      partitionKey: {
        name: "__PK",
        type: AttributeType.STRING,
      },
    });

    new DefualtUserPool(this, "UserPool", {
      domainPrefix: "tsukiy0-cdk-tools",
      callbackUrls: ["https://localhost:3000"],
      redirectUrl: "https://localhost:3000",
    });
  }
}
