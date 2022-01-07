import {
  AmazonLinuxGeneration,
  CloudFormationInit,
  IInstance,
  InitCommand,
  InitFile,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IVpc,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class PublicPgDb extends Construct {
  public readonly host: string;
  public readonly port: string;
  public readonly username: string;
  public readonly password: string;
  public readonly database: string;
  public readonly instance: IInstance;

  public constructor(
    scope: Construct,
    id: string,
    props: {
      vpc: IVpc;
      password: string;
      instanceType?: InstanceType;
    }
  ) {
    super(scope, id);

    const securityGroup = new SecurityGroup(this, "SecurityGroup", {
      allowAllOutbound: true,
      vpc: props.vpc,
    });

    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));
    securityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(5432));
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.allTraffic());

    const instance = new Instance(this, "Instance", {
      vpc: props.vpc,
      securityGroup,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType:
        props.instanceType ??
        InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
      machineImage: MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      init: CloudFormationInit.fromElements(
        InitFile.fromString(
          "/etc/yum.repos.d/pgdg.repo",
          `[pgdg13]
name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
baseurl=https://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0`
        ),
        InitCommand.shellCommand("sudo yum update -y"),
        InitCommand.shellCommand(
          "sudo yum -y install postgresql13 postgresql13-server"
        ),
        InitCommand.shellCommand(
          "sudo /usr/pgsql-13/bin/postgresql-13-setup initdb"
        ),
        InitCommand.shellCommand(`sudo systemctl start postgresql-13`),
        InitCommand.shellCommand(`sudo systemctl enable postgresql-13`),
        InitCommand.shellCommand(
          `sudo -u postgres psql -c "ALTER USER postgres PASSWORD '${props.password}';"`
        ),
        InitCommand.shellCommand(
          `sudo echo "listen_addresses = '*'" >> /var/pgsql/13/data/postgresql.conf`
        ),
        InitCommand.shellCommand(
          `sudo echo "host all all 0.0.0.0/0 md5" >> /var/pgsql/13/data/pg_hba.conf`
        ),
        InitCommand.shellCommand(`sudo systemctl restart postgresql-13`)
      ),
    });

    this.host = instance.instancePublicDnsName;
    this.port = "5432";
    this.username = "postgres";
    this.password = props.password;
    this.database = "postgres";
    this.instance = instance;
  }
}
