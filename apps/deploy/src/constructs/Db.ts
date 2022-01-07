import { DefaultVpc, PublicPgDb } from '@tsukiy0/aws-cdk-tools';
import { Construct } from 'constructs';

export class Db extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new DefaultVpc(this, 'Vpc', {});

    new PublicPgDb(this, 'PublicPgDb', {
      vpc,
      password: 'postgres',
    });
  }
}
