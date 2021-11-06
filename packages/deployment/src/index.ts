import { AppStack } from './stacks/AppStack';
import { App } from 'aws-cdk-lib';

const app = new App();

new AppStack(app, 'AwsCdkToolsAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
