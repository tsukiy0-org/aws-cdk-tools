import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  BehaviorOptions,
  CachePolicy,
  Distribution,
  ICachePolicy,
  IDistribution,
  OriginProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, ISource } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { DefaultBucket } from './DefaultBucket';

export class S3StaticSite extends Construct {
  private readonly cdn: IDistribution;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      source: ISource;
      cacheBehaviors: { path: string; cachePolicy: ICachePolicy }[];
      domainName?: {
        certificate: ICertificate;
        domainName: string;
      };
    }
  ) {
    super(scope, id);

    const bucket = new DefaultBucket(this, 'Bucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [props.source],
    });

    const origin = new HttpOrigin(bucket.bucketWebsiteDomainName, {
      protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
    });

    const cdn = new Distribution(this, 'CloudFront', {
      certificate: props.domainName?.certificate,
      domainNames: props.domainName ? [props.domainName.domainName] : undefined,
      defaultBehavior: {
        origin,
        cachePolicy: CachePolicy.CACHING_DISABLED,
      },
      additionalBehaviors: props.cacheBehaviors.reduce<
        Record<string, BehaviorOptions>
      >((acc, next) => {
        return {
          ...acc,
          [next.path]: {
            origin,
            cachePolicy: next.cachePolicy,
          },
        };
      }, {}),
    });

    this.cdn = cdn;
  }

  public getUrl = () => {
    return `https://${this.cdn.distributionDomainName}`;
  };
}
