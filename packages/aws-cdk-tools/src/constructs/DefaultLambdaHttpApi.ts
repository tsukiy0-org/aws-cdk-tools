import {
  CorsHttpMethod,
  IDomainName,
  HttpApi,
  HttpApiProps,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Cors } from 'aws-cdk-lib/lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/lib/aws-lambda';
import { Construct } from 'constructs';

export class DefaultLambdaHttpApi extends HttpApi {
  constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      domainName?: IDomainName;
    } & Pick<HttpApiProps, 'apiName'>
  ) {
    super(scope, id, {
      apiName: props.apiName,
      defaultIntegration: new LambdaProxyIntegration({
        handler: props.fn,
      }),
      corsPreflight: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      createDefaultStage: true,
      defaultDomainMapping: props.domainName
        ? {
            domainName: props.domainName,
          }
        : undefined,
    });
  }
}