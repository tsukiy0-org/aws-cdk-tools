import { Duration } from 'aws-cdk-lib';
import {
  Function as LambdaFunction,
  FunctionProps,
} from 'aws-cdk-lib/lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/lib/aws-logs';
import { Construct } from 'constructs';

export class DefaultFunction extends LambdaFunction {
  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      memorySize: 128,
      timeout: Duration.seconds(30),
      logRetention: RetentionDays.SIX_MONTHS,
      retryAttempts: 0,
      ...props,
    });
  }
}
