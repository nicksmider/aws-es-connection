import { AwsSignedConnection } from '../index';
import { URL } from 'url';

const mockEndpoint = jest.fn((...args) => ({
  ...args,
  host: 'http://website.com:9200',
}));
const mockHttpRequest = jest.fn((...args) => args);
const mockSigners = jest.fn((...args) => args);

jest.mock('aws-sdk', () => {
  return {
    config: {
      credentials: {
        accessKeyId: 'fakeKey',
      },
      region: 'us-east-1',
    },
    Endpoint: jest.fn().mockImplementation((...args) => mockEndpoint(...args)),
    HttpRequest: jest.fn().mockImplementation((...args) => mockHttpRequest(...args)),
    Signers: {
      V4: jest.fn().mockImplementation(() => {
        return { addAuthorization: (...args) => mockSigners(...args) };
      }),
    },
  };
});

// Simple test to make sure everything connects
test('AwsSignedConnection', () => {
  const connection = new AwsSignedConnection({
    url: new URL('http://website.com'),
  });
  const response = connection.request(
    {
      method: 'POST',
      headers: {
        Content: 'application/json',
        Accept: 'application/json',
      },
      path: '/_search',
      port: '9200',
    },
    () => null,
  );
  expect(response).toBeTruthy();
});
