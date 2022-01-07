import { Construct } from 'constructs';
import {
  ComputeEnvironment,
  ComputeResourceType,
} from '@aws-cdk/aws-batch-alpha';
import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';

export class FargateComputeEnvironment extends ComputeEnvironment {
  public constructor(
    scope: Construct,
    id: string,
    props: {
      vpc: IVpc;
      vpcSubnets: SubnetSelection;
      spot: boolean;
      vcpus: number;
    }
  ) {
    super(scope, id, {
      enabled: true,
      managed: true,
      computeResources: {
        type: props.spot
          ? ComputeResourceType.FARGATE_SPOT
          : ComputeResourceType.FARGATE,
        maxvCpus: props.vcpus,
        vpc: props.vpc,
        vpcSubnets: props.vpcSubnets,
      },
    });
  }
}
