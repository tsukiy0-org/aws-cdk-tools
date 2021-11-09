import { SQSHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler: SQSHandler = async (e) => {
  const tableName = process.env.TABLE_NAME;
  const id = e.Records[0]?.body;

  await new DynamoDB.DocumentClient()
    .put({
      TableName: tableName,
      Item: {
        __PK: id,
      },
    })
    .promise();
};
