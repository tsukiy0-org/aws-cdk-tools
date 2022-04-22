import { S3 } from "aws-sdk";

exports.handler = async (event) => {
  console.log(event);
  const work = async () => {
    const s3 = new S3();
    const { BUCKET_NAME, RANDOM_SEED, ServiceToken, ...rest } =
      event.ResourceProperties;
    await s3
      .upload({
        Bucket: BUCKET_NAME,
        Key: "config.json",
        ContentType: "application/json",
        Body: JSON.stringify(rest),
      })
      .promise();
  };
  switch (event.RequestType) {
    case "Create":
    case "Update":
      await work();
      return;
    case "Delete":
    default:
  }
};
