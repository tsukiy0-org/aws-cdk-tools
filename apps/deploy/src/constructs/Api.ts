import {
  DefaultFunction,
  DefaultFunctionHttpApi,
  HttpPingAlarm,
} from "@tsukiy0/aws-cdk-tools";
import { Construct } from "constructs";
import {
  Code,
  FunctionUrl,
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Cors } from "aws-cdk-lib/aws-apigateway";

export class Api extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new DefaultFunction(this, "Fn", {
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
      handler: "index.handler",
    });

    const fnUrl = new FunctionUrl(this, "FnUrl", {
      function: fn,
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: Cors.ALL_ORIGINS,
        allowedMethods: [HttpMethod.ALL],
        allowedHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const api = new DefaultFunctionHttpApi(this, "Api", {
      apiName: "AwsCdkToolsApi",
      fn,
    });

    const pingAlarms = new HttpPingAlarm(this, "PingAlarm", {
      url: api.url!,
      threshold: 1,
    });

    new StringParameter(this, "ApiUrl", {
      parameterName: "/cdk-tools/api/url",
      stringValue: api.url!,
    });

    new StringParameter(this, "FunctionUrl", {
      parameterName: "/cdk-tools/function/url",
      stringValue: fnUrl.url,
    });

    new StringParameter(this, "PingAlarmName", {
      parameterName: "/cdk-tools/api/ping-alarm-name",
      stringValue: pingAlarms.alarms.map((_) => _.alarmName)[0],
    });
  }
}
