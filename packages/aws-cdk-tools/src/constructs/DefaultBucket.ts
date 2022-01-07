import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class DefaultBucket extends Bucket {
  constructor(scope: Construct, id: string, props: BucketProps) {
    super(scope, id, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      ...props,
    });
  }
}
