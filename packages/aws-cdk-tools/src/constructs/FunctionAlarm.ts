import { IAlarm } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export class FunctionAlarm extends Construct {
  public readonly alarms: IAlarm[];

  public constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      thresholds: {
        maxErrorCount?: number;
        maxThrottleCount?: number;
        maxDurationInSeconds?: number;
      };
    }
  ) {
    super(scope, id);

    const alarms = [
      ...(props.thresholds.maxErrorCount
        ? [
            props.fn
              .metricErrors({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxErrorCount', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxErrorCount,
              }),
          ]
        : []),
      ...(props.thresholds.maxThrottleCount
        ? [
            props.fn
              .metricThrottles({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxThrottleCount', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxThrottleCount,
              }),
          ]
        : []),
      ...(props.thresholds.maxDurationInSeconds
        ? [
            props.fn
              .metricDuration({
                statistic: 'sum',
              })
              .createAlarm(this, 'MaxDurationInSeconds', {
                evaluationPeriods: 1,
                threshold: props.thresholds.maxDurationInSeconds * 1000,
              }),
          ]
        : []),
    ];

    this.alarms = alarms;
  }
}
