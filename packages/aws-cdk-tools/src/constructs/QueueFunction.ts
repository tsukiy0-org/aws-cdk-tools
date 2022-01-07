import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { RetryQueue } from "./RetryQueue";

export class QueueFunction extends Construct {
  public readonly queue: IQueue;
  public readonly deadLetterQueue: IQueue;

  constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      fnTimeout: Duration;
      maxRetries: number;
    }
  ) {
    super(scope, id);

    const retryQueue = new RetryQueue(this, "Queue", {
      queueProps: {
        // https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
        visibilityTimeout: Duration.millis(
          6 * props.fnTimeout.toMilliseconds()
        ),
      },
      maxRetries: props.maxRetries,
    });

    props.fn.addEventSource(
      new SqsEventSource(retryQueue.queue, {
        batchSize: 1,
        enabled: true,
      })
    );

    props.fn.addEventSource(
      new SqsEventSource(retryQueue.deadLetterQueue, {
        batchSize: 1,
        enabled: false,
      })
    );

    this.queue = retryQueue.queue;
    this.deadLetterQueue = retryQueue.deadLetterQueue;
  }
}
