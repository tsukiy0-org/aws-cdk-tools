import { TestHelpers } from '../support/TestHelpers';
import fetch from 'cross-fetch';

describe('CraWeb', () => {
  let webUrl: string;

  beforeEach(async () => {
    webUrl = await TestHelpers.getParam('/cdk-tools/cra-web/url');
  });

  it('when static then cached', async () => {
    // Act
    await fetch(setUrlPath(webUrl, 'static/css/main.8c8b27cf.chunk.css'));
    const res = await fetch(
      setUrlPath(webUrl, 'static/css/main.8c8b27cf.chunk.css')
    );

    // Assert
    expect(res.status).toBe(200);
    expect(res.headers.get('x-cache')).toBe('Hit from cloudfront');
  });

  it('when index then not cached', async () => {
    // Act
    await fetch(setUrlPath(webUrl, 'index.html'));
    const res = await fetch(setUrlPath(webUrl, 'index.html'));

    // Assert
    expect(res.status).toBe(200);
    expect(res.headers.get('x-cache')).toBe('Miss from cloudfront');
  });

  const setUrlPath = (url: string, pathname: string) => {
    const u = new URL(url);
    u.pathname = pathname;
    return u.toString();
  };
});
