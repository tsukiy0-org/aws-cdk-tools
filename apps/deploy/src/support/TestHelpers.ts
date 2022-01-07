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

  public static retry = async <T>(
    maxRetries: number,
    fn: () => Promise<T>
  ): Promise<T> => {
    let tries = 0;

    while (tries <= maxRetries) {
      try {
        return await fn();
      } catch (e) {
        if (tries === maxRetries) {
          throw e;
        } else {
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
          tries++;
        }
      }
    }

    throw new Error('Should not get here');
  };
}
