import { SSM } from 'aws-sdk';

export class TestHelpers {
  private static ssm = new SSM();

  public static getParam = async (key: string): Promise<string> => {
    const res = await TestHelpers.ssm
      .getParameter({
        Name: key,
        WithDecryption: true,
      })
      .promise();

    const value = res.Parameter?.Value;

    if (!value) {
      throw new Error(`Parameter with key "${key}" not found`);
    }

    return value;
  };
}
