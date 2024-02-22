const { expect } = require('chai');
const {
  verifyResultError,
  verifyResultOk
} = require('helpers/verifiers');
const LoginWithMagicLinkValidator = require('resources/auth/validators/login-with-magic-link-validation');

describe('validation for login with magic link', () => {
  context('Not Valid', () => {
    it('when to is not an email', async () => {
      const response = await LoginWithMagicLinkValidator.validate({});

      verifyResultError(({ error }) => {
        expect(error).include('to should be an email');
      })(response);
    });

    it('when url is not valid url', async () => {
      const response = await LoginWithMagicLinkValidator.validate({});

      verifyResultError(({ error }) => {
        expect(error).include('url should be a valid url');
      })(response);
    });

    it('when theme is not an object', async () => {
      const response = await LoginWithMagicLinkValidator.validate({});

      verifyResultError(({ error }) => {
        expect(error).include('theme should be an object');
      })(response);
    });
  });

  context('Valid', () => {
    it('when all fields are present and valid', async () => {
      const response = await LoginWithMagicLinkValidator.validate({
        to: 'abc@gmal.com',
        url: 'https://meet.google.com',
        theme: {},
      });
      verifyResultOk((error) => {
        expect(error).to.be.empty;
      })(response);
    });
  });
});