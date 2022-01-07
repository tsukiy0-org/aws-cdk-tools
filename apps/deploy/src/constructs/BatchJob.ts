import {
  FargateBatchJob,
  FargateComputeEnvironment,
} from '@tsukiy0/aws-cdk-tools';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { External } from './External';
import * as path from 'path';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { DockerImageAsset } from 'aws-cdk-lib/lib/aws-ecr-assets';

export class BatchJob extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      external: External;
    }
  ) {
    super(scope, id);

    const computeEnvironment = new FargateComputeEnvironment(
      this,
      'ComputeEnvironment',
      {
        vpc: props.external.vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
        spot: true,
        vcpus: 2,
      }
    );

    const job = new FargateBatchJob(this, 'Job', {
      computeEnvironment,
      container: {
        image: ContainerImage.fromDockerImageAsset(
          new DockerImageAsset(this, 'Image', {
            directory: path.resolve(__dirname, '../../static/BatchJob'),
          })
        ),
        environment: {
          TABLE_NAME: props.external.table.tableName,
        },
      },
    });
    props.external.table.grantReadWriteData(job);

    new StringParameter(this, 'JobDefinitionArn', {
      parameterName: '/cdk-tools/batch-job/job-definition-arn',
      stringValue: job.definition.jobDefinitionArn,
    });

    new StringParameter(this, 'JobQueueArn', {
      parameterName: '/cdk-tools/batch-job/job-queue-arn',
      stringValue: job.queue.jobQueueArn,
    });

    new StringParameter(this, 'TableName', {
      parameterName: '/cdk-tools/batch-job/table-name',
      stringValue: props.external.table.tableName,
    });
  }
}
