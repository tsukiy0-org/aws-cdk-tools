import { AppStack } from './stacks/AppStack';
import { App } from 'aws-cdk-lib';
import { ExternalStack } from './stacks/ExternalStack';

const app = new App();
const tableName = 'aws-cdk-tools-table';

new ExternalStack(app, 'AwsCdkToolsExternalStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tableName,
});

new AppStack(app, 'AwsCdkToolsAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tableName,
});
