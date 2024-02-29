const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
const SendMagicLinkViaEmailService = require('resources/auth/services/send-magic-link-via-email-service');
const NotificationHandler = require('notifications/notification-handler');
const { resolveOk } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");

chai.use(sinonChai);
describe("send magic link via email service", () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
    });

    it("should send magic link", async () => {
        const to = 'some email';
        const theme = {
            brandColor: 'color',
            buttonText: 'buttonText'
        };
        const url = 'http://google.com';
        const { host } = new URL(url)

        sandbox.mock(NotificationHandler,).expects('send').withArgs(
            verifyArgs((args) => {
                expect(args).to.be.eqls({
                    context: "loginMagicLink",
                    modes: [{ name: "email", to }],
                    data: {
                        background: "#f9f9f9",
                        text: "#444",
                        mainBackground: "#fff",
                        buttonBackground: theme.brandColor,
                        buttonBorder: theme.brandColor,
                        buttonText: theme.buttonText || "#fff",
                        escapedHost: host.replace(/\./g, "&#8203;."),
                        url
                    },
                });
            })
        ).resolves(resolveOk({}));

        const response = await SendMagicLinkViaEmailService.send({ to, theme, url });

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eqls({});
        })(response);
    });

    it("should send magic link with optional theme values", async () => {
        const to = 'some email';
        const theme = {};
        const url = 'http://google.com';
        const { host } = new URL(url)

        sandbox.mock(NotificationHandler,).expects('send').withArgs(
            verifyArgs((args) => {
                expect(args).to.be.eqls({
                    context: "loginMagicLink",
                    modes: [{ name: "email", to }],
                    data: {
                        background: "#f9f9f9",
                        text: "#444",
                        mainBackground: "#fff",
                        buttonBackground: "#346df1",
                        buttonBorder: "#346df1",
                        buttonText: "#fff",
                        escapedHost: host.replace(/\./g, "&#8203;."),
                        url
                    },
                });
            })
        ).resolves(resolveOk({}));
        const response = await SendMagicLinkViaEmailService.send({ to, theme, url });

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eqls({});
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
