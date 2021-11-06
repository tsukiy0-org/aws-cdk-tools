import { TestHelpers } from '../support/TestHelpers';
import fetch from 'cross-fetch';
import { CloudWatch } from 'aws-sdk';

describe('Api', () => {
  let apiUrl: string;

  beforeEach(async () => {
    apiUrl = await TestHelpers.getParam('/cdk-tools/api/url');
  });

  it('returns 200', async () => {
    // Act
    const res = await fetch(apiUrl);

    // Assert
    expect(res.status).toBe(200);
  });

  it('ping alarm has status', async () => {
    // Arrange
    const alarmName = await TestHelpers.getParam(
      '/cdk-tools/api/ping-alarm-name'
    );

    // Act
    const history = await new CloudWatch()
      .describeAlarmHistory({
        AlarmName: alarmName,
        HistoryItemType: 'StateUpdate',
        MaxRecords: 10,
      })
      .promise();

    // Assert
    expect(history.AlarmHistoryItems.length).toBeGreaterThan(0);
  });
});
