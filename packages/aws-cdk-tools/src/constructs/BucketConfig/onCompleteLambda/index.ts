import { CdkCustomResourceIsCompleteHandler } from "aws-lambda";

export const handler: CdkCustomResourceIsCompleteHandler = async () => {
  return {
    IsComplete: true,
  };
};
