import { DynamoDB, SQS } from "aws-sdk";
import { TestHelpers } from "../support/TestHelpers";
import * as uuid from "uuid";

describe("SqsJob", () => {
  it("handles messages", async () => {
    // Arrange
    const queueUrl = await TestHelpers.getParam("/cdk-tools/sqs-job/queue-url");
    const tableName = await TestHelpers.getParam(
      "/cdk-tools/sqs-job/table-name"
    );
    const key = uuid.v4();

    // Act
    await new SQS()
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: key,
      })
      .promise();
    const actual = await TestHelpers.retry(20, async () => {
      const res = await new DynamoDB.DocumentClient()
        .get({
          TableName: tableName,
          Key: {
            __PK: key,
          },
        })
        .promise();

      if (!res.Item) {
        throw new Error("Item not found");
      }

      return res.Item;
    });

    // Assert
    expect(actual).not.toBeUndefined();
  });
});
