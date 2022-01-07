const DynamoDB = require("aws-sdk").DynamoDB;

exports.handler = async (e) => {
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
