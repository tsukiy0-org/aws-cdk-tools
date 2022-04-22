import { CustomResource, Duration } from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { DefaultFunction } from "../DefaultFunction";
import path from "path";

export class BucketConfig extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      bucket: IBucket;
      config: Record<string, string>;
    }
  ) {
    super(scope, id);

    const timeout = Duration.seconds(30);

    const onEventFn = new DefaultFunction(this, "OnEventFunction", {
      code: Code.fromAsset(path.resolve(__dirname, "./onEventLambda")),
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
      timeout,
    });
    props.bucket.grantWrite(onEventFn);

    const onCompleteFn = new DefaultFunction(this, "OnCompleteFunction", {
      code: Code.fromAsset(path.resolve(__dirname, "./onCompleteLambda")),
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
      timeout,
    });

    const provider = new Provider(this, "Provider", {
      onEventHandler: onEventFn,
      isCompleteHandler: onCompleteFn,
      totalTimeout: timeout,
    });

    new CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      properties: {
        RANDOM_SEED: Math.floor(Math.random() * 1000000),
        BUCKET_NAME: props.bucket.bucketName,
        ...props.config,
      },
    });
  }
}
