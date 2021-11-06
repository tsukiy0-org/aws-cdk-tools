import { IAlarm } from 'aws-cdk-lib/lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/lib/aws-lambda';

export class FunctionAlarm extends Construct {
  public readonly alarms: IAlarm[];

  public constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      thresholds: {
        maxErrors?: number;
        maxThrottles?: number;
        maxDuration?: number;
      };
    }
  ) {
    super(scope, id);

    const alarms = [
      ...(props.thresholds.maxErrors
        ? [
            props.fn
              .metricErrors({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxErrors', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxErrors,
              }),
          ]
        : []),
      ...(props.thresholds.maxThrottles
        ? [
            props.fn
              .metricThrottles({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxThrottles', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxThrottles,
              }),
          ]
        : []),
      ...(props.thresholds.maxDuration
        ? [
            props.fn
              .metricDuration({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxDuration', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxDuration,
              }),
          ]
        : []),
    ];

    this.alarms = alarms;
  }
}
