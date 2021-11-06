import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Alarm } from 'aws-cdk-lib/lib/aws-cloudwatch';
import { Rule, Schedule } from 'aws-cdk-lib/lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/lib/aws-events-targets';
import { Construct } from 'constructs';

export class CronFunction extends Construct {
  public readonly alarm: Alarm;

  constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      schedule: Schedule;
    }
  ) {
    super(scope, id);

    const rule = new Rule(this, 'Rule', {
      schedule: props.schedule,
    });
    rule.addTarget(new LambdaFunction(props.fn));
  }
}
