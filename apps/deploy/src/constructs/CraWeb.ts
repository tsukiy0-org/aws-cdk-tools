import { S3StaticSite } from "@tsukiy0/aws-cdk-tools";
import { Construct } from "constructs";
import { Source } from "aws-cdk-lib/aws-s3-deployment";
import { CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import * as path from "path";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class CraWeb extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const site = new S3StaticSite(this, "S3StaticSite", {
      source: Source.asset(path.resolve(__dirname, "../../static/web")),
      cacheBehaviors: [
        {
          path: "/static/*",
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        },
      ],
    });

    new StringParameter(this, "Url", {
      parameterName: "/cdk-tools/cra-web/url",
      stringValue: site.getUrl(),
    });
  }
}
