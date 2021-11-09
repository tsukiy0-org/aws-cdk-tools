import { IQueue, QueueProps } from 'aws-cdk-lib/lib/aws-sqs';
import { Construct } from 'constructs';
import { DefaultQueue } from './DefaultQueue';

export class RetryQueue extends Construct {
  public readonly queue: IQueue;
  public readonly deadLetterQueue: IQueue;

  constructor(
    scope: Construct,
    id: string,
    props: {
      queueProps: Omit<QueueProps, 'deadLetterQueue'>;
      maxRetries: number;
    }
  ) {
    super(scope, id);

    const deadLetterQueue = new DefaultQueue(this, 'DeadLetterQueue', {});

    const queue = new DefaultQueue(this, 'Queue', {
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: props.maxRetries,
      },
      ...props.queueProps,
    });

    this.queue = queue;
    this.deadLetterQueue = deadLetterQueue;
  }
}
