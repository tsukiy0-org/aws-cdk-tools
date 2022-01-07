import {
  CorsHttpMethod,
  IDomainName,
  HttpApi,
  HttpApiProps,
  DomainName,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class DefaultFunctionHttpApi extends HttpApi {
  constructor(
    scope: Construct,
    id: string,
    props: {
      fn: IFunction;
      domain?: {
        domainName: string;
        certificate: ICertificate;
      }
    } & Pick<HttpApiProps, 'apiName'>
  ) {
    super(scope, id, {
      apiName: props.apiName,
      defaultIntegration: new HttpLambdaIntegration("DefaultIntegration", props.fn),
      corsPreflight: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
      createDefaultStage: true,
      defaultDomainMapping: props.domain
        ? {
            domainName: new DomainName(scope, "DomainName", {
              domainName: props.domain.domainName,
              certificate: props.domain.certificate,
            }),
          }
        : undefined,
    });
  }
}
