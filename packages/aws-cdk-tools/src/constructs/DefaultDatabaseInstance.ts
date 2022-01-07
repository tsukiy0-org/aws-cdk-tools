import { RemovalPolicy } from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
} from 'aws-cdk-lib/aws-ec2';
import {
  DatabaseInstance,
  StorageType,
  DatabaseInstanceProps,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class DefaultDatabaseInstance extends DatabaseInstance {
  public constructor(
    scope: Construct,
    id: string,
    props: DatabaseInstanceProps & Required<Pick<DatabaseInstanceProps, 'port'>>
  ) {
    super(scope, id, {
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO
      ),
      storageType: StorageType.GP2,
      allocatedStorage: 10,
      deletionProtection: false,
      removalPolicy: RemovalPolicy.DESTROY,
      ...props,
    });
  }
}
