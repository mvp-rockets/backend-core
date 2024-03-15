const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { resolveOk, resolveError } = require('helpers/resolvers');
const AWS = require('resources/aws/s3-bucket.js'); // Replace with the correct path
const TestRoutes = require('helpers/test-route');
const verifiers = require('helpers/verifiers');

describe('Fetch Presigned URL API', () => {
    const sandbox = sinon.createSandbox();

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                fileKey: 'example-file-key',
            },
        };
        res = {
            send: sandbox.spy(),
            status: sandbox.spy(() => res),
        };
    });

    context('when successfully fetching presigned URL', () => {
        it('should respond with the presigned URL', async () => {
            const presignedUrl = 'https://example.com/presigned-url';

            sandbox.stub(AWS, 'getUploadPreSignedUrl').resolves(resolveOk(presignedUrl));

            const response = await TestRoutes.execute('/aws/get-upload-pre-signed-url', 'Post', req, res);

            expect(response).to.eql({
                status: true,
                message: 'Successfully fetched presigned url!',
                entity: presignedUrl,
            });
        });
    });

    // context('when failing to fetch presigned URL', () => {
    //     it('should respond with an error message', async () => {
    //         const errorMessage = 'Failed to fetch presigned url';

    //         sandbox.stub(AWS, 'getUploadPreSignedUrl').rejects(resolveError(errorMessage));

    //         const response = await TestRoutes.executeWithError('/aws/get-upload-pre-signed-url', 'Post', req, res);
    //         verifiers.verifyResultError((response) => {
    //             expect(response).to.eql(errorMessage);
    //         })(response);

    //     });
    // });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
