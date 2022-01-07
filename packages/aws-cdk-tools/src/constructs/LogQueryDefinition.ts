import { Names } from 'aws-cdk-lib';
import { CfnQueryDefinition, ILogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class LogQueryDefinition extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      name?: string;
      logGroups: ILogGroup[];
      queryString: string;
    }
  ) {
    super(scope, id);

    new CfnQueryDefinition(this, 'QueryDefinition', {
      name: props.name ?? Names.uniqueId(this),
      logGroupNames: props.logGroups.map((_) => _.logGroupName),
      queryString: props.queryString,
    });
  }
}
