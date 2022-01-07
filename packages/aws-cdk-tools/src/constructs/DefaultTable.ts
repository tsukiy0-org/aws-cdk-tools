import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode, Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DefaultTable extends Table {
  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      ...props,
    });
  }
}
