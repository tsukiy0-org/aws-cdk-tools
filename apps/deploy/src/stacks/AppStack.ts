import { BillingAlarm } from "@tsukiy0/aws-cdk-tools";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Api } from "../constructs/Api";
import { BatchJob } from "../constructs/BatchJob";
import { CraWeb } from "../constructs/CraWeb";
import { External } from "../constructs/External";
import { SqsJob } from "../constructs/SqsJob";

export class AppStack extends Stack {
  public constructor(
    scope: Construct,
    id: string,
    props: StackProps & {
      tableName: string;
    }
  ) {
    super(scope, id, props);

    const external = new External(this, "External", {
      tableName: props.tableName,
    });

    new BillingAlarm(this, "BillingAlarm", {
      amountUSD: 10,
    });

    new Api(this, "Api");

    new CraWeb(this, "CraWeb");

    new SqsJob(this, "SqsJob", {
      external,
    });

    new BatchJob(this, "BatchJob", {
      external,
    });
  }
}
