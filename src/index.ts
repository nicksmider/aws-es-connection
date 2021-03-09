/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection as UnsignedConnection } from '@elastic/elasticsearch';
import * as AWS from 'aws-sdk';

import { ClientRequest, RequestOptions, IncomingMessage } from 'http';

class AwsElasticsearchError extends Error {}

class AwsSignedConnection extends UnsignedConnection {
  public request(
    params: RequestOptions,
    callback: (err: Error | null, response: IncomingMessage | null) => void,
  ): ClientRequest {
    const signedParams = this.signParams(params);
    return super.request(signedParams, callback);
  }

  private signParams(params: any): RequestOptions {
    const region = AWS.config.region || process.env.AWS_DEFAULT_REGION;
    if (!region) {
      throw new AwsElasticsearchError('missing region configuration');
    }

    const endpoint = new AWS.Endpoint(this.url.href);
    const request = new AWS.HttpRequest(endpoint, region);

    request.method = params.method;
    request.path = params.querystring ? `${params.path}/?${params.querystring}` : params.path;
    request.body = params.body;

    request.headers = params.headers;
    request.headers.Host = endpoint.host;

    const signer = new (AWS as any).Signers.V4(request, 'es');
    signer.addAuthorization(AWS.config.credentials, new Date());
    return request;
  }
}

export { AwsSignedConnection, AwsElasticsearchError };
