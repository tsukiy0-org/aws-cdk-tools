import { TestHelpers } from '../support/TestHelpers';
import fetch from 'cross-fetch';

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
});
