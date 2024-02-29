const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {
    resolveOk,
    resolveError
} = require('helpers/resolvers');
const { verifyArgs, verifyResultOk, verifyResultError } = require('helpers/verifiers');
const TokenVerifier = require('lib/token-verifier');
const { token } = require('@mvp-rockets/namma-lib');
const AzureTokenVerifier = require('lib/azure-ad-token-verifier.js');
const GoogleTokenVerifier = require('lib/google-token-verifier');

const { expect } = chai;
chai.use(sinonChai);

describe('Token verifier', () => {
    const sandbox = sinon.createSandbox();
    let data;
    beforeEach(() => {
        data = {
            clientToken: 'clientToke valid'
        }
    });

    context('success', () => {
        it('should return payload for default type and valid token', async () => {
            sandbox
                .mock(token)
                .expects('decode')
                .withArgs(verifyArgs((token) => {
                    expect(token).to.be.eqls(data.clientToken);
                }))
                .returns(resolveOk(data));

            const response = await TokenVerifier.verify(data);

            verifyResultOk((result) => {
                expect(result).to.eql(data);
            })(response)
        });

        it('should return payload for azure type and valid token', async () => {
            data.type = 'azure';

            sandbox
                .mock(AzureTokenVerifier)
                .expects('verifyToken')
                .withArgs(verifyArgs((token) => {
                    expect(token).to.be.eqls({ clientToken: data.clientToken });
                }))
                .returns(resolveOk(data));

            const response = await TokenVerifier.verify(data);

            verifyResultOk((result) => {
                expect(result).to.eql(data);
            })(response)
        });

        it('should return payload for google type and valid token', async () => {
            data.type = 'google';

            sandbox
                .mock(GoogleTokenVerifier)
                .expects('verifyToken')
                .withArgs(verifyArgs((token) => {
                    expect(token).to.be.eqls({ clientToken: data.clientToken });
                }))
                .returns(resolveOk(data));

            const response = await TokenVerifier.verify(data);

            verifyResultOk((result) => {
                expect(result).to.eql(data);
            })(response)
        });
    });

    context('error', () => {
        it('should return error for unknown type', async () => {
            data.type = 'unknown';

            const response = await TokenVerifier.verify(data);

            verifyResultError((result) => {
                expect(result).to.eql('Invalid decoder type');
            })(response)
        });

        it('should return error for default type and invalid token', async () => {
            sandbox
                .mock(token)
                .expects('decode')
                .withArgs(verifyArgs((token) => {
                    expect(token).to.be.eqls(data.clientToken);
                }))
                .returns(resolveError('invalid token'));

            const response = await TokenVerifier.verify(data);

            verifyResultError((result) => {
                expect(result).to.eql('invalid token');
            })(response)
        });

        it('should return error for azure type and invalid token', async () => {
            data.type = 'azure';

            sandbox
                .mock(AzureTokenVerifier)
                .expects('verifyToken')
                .withArgs(verifyArgs((token) => {
                    expect(token).to.be.eqls({ clientToken: data.clientToken });
                }))
                .returns(resolveError('invalid token'));

            const response = await TokenVerifier.verify(data);

            verifyResultError((result) => {
                expect(result).to.eql('invalid token');
            })(response)
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
