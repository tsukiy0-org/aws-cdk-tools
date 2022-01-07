import { Batch, DynamoDB } from "aws-sdk";
import { TestHelpers } from "../support/TestHelpers";
import * as uuid from "uuid";

describe("BatchJob", () => {
  it("handles messages", async () => {
    // Arrange
    const jobDefinitionArn = await TestHelpers.getParam(
      "/cdk-tools/batch-job/job-definition-arn"
    );
    const jobQueueArn = await TestHelpers.getParam(
      "/cdk-tools/batch-job/job-queue-arn"
    );
    const tableName = await TestHelpers.getParam(
      "/cdk-tools/batch-job/table-name"
    );
    const key = uuid.v4();

    // Act
    await new Batch()
      .submitJob({
        jobName: key,
        jobQueue: jobQueueArn,
        jobDefinition: jobDefinitionArn,
        containerOverrides: {
          environment: [
            {
              name: "MESSAGE",
              value: key,
            },
          ],
        },
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
