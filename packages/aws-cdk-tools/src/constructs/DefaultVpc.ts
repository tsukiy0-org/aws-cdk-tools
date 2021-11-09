import { Construct } from 'constructs';
import { SubnetType, Vpc, VpcProps } from 'aws-cdk-lib/aws-ec2';

export class DefaultVpc extends Vpc {
  public constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id, {
      cidr: Vpc.DEFAULT_CIDR_RANGE,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
      ],
      ...props,
    });
  }
}
