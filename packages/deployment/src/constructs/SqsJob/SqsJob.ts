import { DefaultFunction, QueueFunction } from '@tsukiy0/aws-cdk-tools';
import { Construct } from 'constructs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { External } from '../External';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export class SqsJob extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      external: External;
    }
  ) {
    super(scope, id);

    const timeout = Duration.seconds(30);
    const fn = new DefaultFunction(this, 'Fn', {
      code: Code.fromAsset(path.resolve(__dirname, './lambda')),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
      timeout,
      environment: {
        TABLE_NAME: props.external.table.tableName,
      },
    });
    props.external.table.grantReadWriteData(fn);

    const queueFn = new QueueFunction(this, 'QueueFn', {
      fn,
      fnTimeout: timeout,
      maxRetries: 1,
    });

    new StringParameter(this, 'QueueUrl', {
      parameterName: '/cdk-tools/sqs-job/queue-url',
      stringValue: queueFn.queue.queueUrl,
    });

    new StringParameter(this, 'TableName', {
      parameterName: '/cdk-tools/sqs-job/table-name',
      stringValue: props.external.table.tableName,
    });
  }
}
