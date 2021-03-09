# aws-es-connection

## Purpose

When restricting AWS Elasticsearch to an IAM user/role, requests need to be signed to be accepted.

There is an [outdated connection package for the legacy elasticsearch client](https://github.com/TheDeveloper/http-aws-es), but there is no packaged for for the newewst `@elastic/elasticsearch` client, until now.

This is based on code provided in an [issue](https://github.com/elastic/elasticsearch-js/issues/951) on the client's repo. I adapted the example to be used from an npm package.
## Usage

### Install

```bash
npm i @smidges/aws-es-connection
```

### Peer Dependencies

You must install these packages along side as they will not be included by default.

```bash
npm install aws-sdk @elastic/elasticsearch
```

### Region

AWS Region has to be defined in order to sign the requests.

Either `AWS.config.region` or `process.env.AWS_DEFAULT_REGION` should be set to the region of choice.

### Credentials

The package assumes `AWS.config.credentials` is configured already with the correct role needed to access Elasticsearch.

```typescript
import { Client, Connection } from '@elastic/elasticsearch';
import { AwsSignedConnection } from '@smidges/aws-es-connection';
import * as AWS from 'aws-sdk';


const client = new Client({
  node: 'https://<unique-url>.us-east-1.es.amazonaws.com',
  Connection: AWS.config.credentials ? AwsSignedConnection : Connection,
});
```
