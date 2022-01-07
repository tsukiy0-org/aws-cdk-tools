import { Duration } from "aws-cdk-lib";
import { Queue, QueueProps } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DefaultQueue extends Queue {
  constructor(scope: Construct, id: string, props: QueueProps) {
    super(scope, id, {
      retentionPeriod: Duration.days(14),
      ...props,
    });
  }
}
