const DynamoDB = require("aws-sdk").DynamoDB;

const handler = async () => {
  const tableName = process.env.TABLE_NAME;
  const id = process.env.MESSAGE;

  await new DynamoDB.DocumentClient()
    .put({
      TableName: tableName,
      Item: {
        __PK: id,
      },
    })
    .promise();
};

handler();
