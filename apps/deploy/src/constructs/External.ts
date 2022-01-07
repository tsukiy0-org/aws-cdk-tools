import { Construct } from "constructs";
import { ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { DefaultVpc } from "@tsukiy0/aws-cdk-tools";
import { IVpc } from "aws-cdk-lib/aws-ec2";

export class External extends Construct {
  public readonly vpc: IVpc;
  public readonly table: ITable;

  constructor(
    scope: Construct,
    id: string,
    props: {
      tableName: string;
    }
  ) {
    super(scope, id);

    const vpc = new DefaultVpc(this, "Vpc", {});

    const table = Table.fromTableAttributes(this, "Table", {
      tableName: props.tableName,
    });

    this.vpc = vpc;
    this.table = table;
  }
}
