import { DefaultFunction, DefaultLambdaHttpApi } from '@tsukiy0/aws-cdk-tools';
import { Construct } from 'constructs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export class Api extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new DefaultFunction(this, 'Fn', {
      code: Code.fromInline(`
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "hello :)"
        })
    };
    return response;
};
      `),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });

    const api = new DefaultLambdaHttpApi(this, 'Api', {
      apiName: 'AwsCdkToolsApi',
      fn,
    });

    new StringParameter(this, 'ApiUrl', {
      parameterName: '/cdk-tools/api/url',
      stringValue: api.url,
    });
  }
}
