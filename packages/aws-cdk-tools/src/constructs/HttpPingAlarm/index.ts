import { IAlarm } from 'aws-cdk-lib/aws-cloudwatch';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DefaultFunction } from '../DefaultFunction';
import * as path from 'path';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { Duration } from 'aws-cdk-lib';
import { CronFunction } from '../CronFunction';
import { FunctionAlarm } from '../FunctionAlarm';

export class HttpPingAlarm extends Construct {
  public readonly alarms: IAlarm[];

  constructor(
    scope: Construct,
    id: string,
    props: {
      url: string;
      threshold: number;
    }
  ) {
    super(scope, id);

    const fn = new DefaultFunction(this, 'Fn', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.resolve(__dirname, './lambda')),
      handler: 'index.handler',
      environment: {
        URL: props.url,
      },
    });

    new CronFunction(this, 'CronFn', {
      fn,
      schedule: Schedule.rate(Duration.minutes(1)),
    });

    const alarms = new FunctionAlarm(this, 'FnAlarm', {
      fn,
      thresholds: {
        maxErrorCount: props.threshold,
      },
    }).alarms;

    this.alarms = alarms;
  }
}
