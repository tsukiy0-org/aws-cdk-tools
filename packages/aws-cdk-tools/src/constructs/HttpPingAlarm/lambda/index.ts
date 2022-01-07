import * as https from 'https';

exports.handler = async () => {
  const url = process.env.URL!;
  return request(url);
};

const request = (url: string) => {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'GET',
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error());
        }

        res.on('end', function () {
          resolve(undefined);
        });
      }
    );

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
};
