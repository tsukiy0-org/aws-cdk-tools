import { Construct } from 'constructs';
import {
  Grant,
  IGrantable,
  IPrincipal,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { RemovalPolicy } from 'aws-cdk-lib';
import {
  IComputeEnvironment,
  IJobDefinition,
  IJobQueue,
  JobDefinition,
  JobDefinitionContainer,
  JobQueue,
  LogDriver,
  PlatformCapabilities,
} from '@aws-cdk/aws-batch-alpha';
import { LogQueryDefinition } from './LogQueryDefinition';

export class FargateBatchJob extends Construct implements IGrantable {
  public readonly definition: IJobDefinition;
  public readonly queue: IJobQueue;
  public readonly logGroup: ILogGroup;
  public readonly grantPrincipal: IPrincipal;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      computeEnvironment: IComputeEnvironment;
      container: Omit<
        JobDefinitionContainer,
        'jobRole' | 'executionRole' | 'logConfiguration'
      >;
    }
  ) {
    super(scope, id);

    const queue = new JobQueue(this, 'JobQueue', {
      computeEnvironments: [
        {
          computeEnvironment: props.computeEnvironment,
          order: 0,
        },
      ],
    });

    const role = new Role(this, 'JobRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    const executionRole = new Role(this, 'JobExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromManagedPolicyArn(
          this,
          'AmazonECSTaskExecutionRolePolicy',
          'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'
        ),
      ],
    });

    const logGroup = new LogGroup(this, 'JobLogGroup', {
      retention: RetentionDays.SIX_MONTHS,
    });
    logGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);
    new LogQueryDefinition(this, 'LogQuery', {
      logGroups: [logGroup],
      queryString: `fields @timestamp, @message, @logStream
| sort @timestamp desc
| limit 100`,
    });

    const definition = new JobDefinition(this, 'JobDefinition', {
      platformCapabilities: [PlatformCapabilities.FARGATE],
      container: {
        vcpus: 0.25,
        memoryLimitMiB: 512,
        assignPublicIp: true,
        executionRole: executionRole,
        jobRole: role,
        logConfiguration: {
          logDriver: LogDriver.AWSLOGS,
          options: {
            'awslogs-group': logGroup.logGroupName,
          },
        },
        ...props.container,
      },
    });

    this.grantPrincipal = role;
    this.definition = definition;
    this.queue = queue;
    this.logGroup = logGroup;
  }

  public readonly grantSubmit = (grantee: IGrantable) => {
    Grant.addToPrincipal({
      grantee,
      actions: ['batch:SubmitJob'],
      resourceArns: [this.queue.jobQueueArn, this.definition.jobDefinitionArn],
    });
  };
}
