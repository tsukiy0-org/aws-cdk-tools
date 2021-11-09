import { Construct } from 'constructs';
import { IPrincipal } from 'aws-cdk-lib/lib/aws-iam';
import { ILogGroup } from 'aws-cdk-lib/lib/aws-logs';
import {
  ComputeEnvironment,
  ComputeEnvironmentProps,
  ComputeResourceType,
  IJobDefinition,
  IJobQueue,
} from '@aws-cdk/aws-batch-alpha';
import { IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';

export class FargateComputeEnvironment extends ComputeEnvironment {
  public readonly definition: IJobDefinition;
  public readonly queue: IJobQueue;
  public readonly logGroup: ILogGroup;
  public readonly grantPrincipal: IPrincipal;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      vpc: IVpc;
      vpcSubnets: SubnetSelection;
      spot: boolean;
      vcpus: ComputeEnvironmentProps['computeResources']['maxvCpus'];
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
