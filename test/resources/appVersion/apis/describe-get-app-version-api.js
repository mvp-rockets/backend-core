const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const uuid = require("uuid");
const db = require("db/repository");
const {
  resolveError,
  resolveOk,
} = require("helpers/resolvers");
const checkVersionService = require("resources/app-version/services/check-version-service");

describe("describe mobile appVersion api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        versionName: "2.1.0",
        os: "android",
      },
    };
    res = {
      setHeader: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy(() => {
        return res;
      }),
    };
  });

  context('Success Cases', () => {
  it("should respond with no update when user is on the latest version", async () => {
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '2.1.0' }))
      .returns(
        resolveOk({
          notifyUpdate: false,
          latestVersion: "2.1.0",
          forceUpdate: false,
          features: [],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.be.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: false,
        latestVersion: "2.1.0",
        forceUpdate: false,
        features: [],
      },
    });
  });

  it("should respond with no update when user is on the minimum version and the latest version is not released", async () => {
    req.body.versionName = "1.9.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '1.9.0' }))
      .returns(
        resolveOk({
          notifyUpdate: false,
          latestVersion: "1.9.0",
          forceUpdate: false,
          features: [],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: false,
        latestVersion: "1.9.0",
        forceUpdate: false,
        features: [],
      },
    });
  });

  it("should respond with update notification and force update when user is on minimum version and a newer version is available", async () => {
    req.body.versionName = "1.9.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '1.9.0' }))
      .returns(
        resolveOk({
          notifyUpdate: true,
          latestVersion: "2.0.1",
          forceUpdate: true,
          features: [],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: true,
        latestVersion: "2.0.1",
        forceUpdate: true,
        features: [],
      },
    });
  });

  it("should respond with update notification without forcing when user is on an older version than the latest", async () => {
    req.body.versionName = "2.0.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '2.0.0' }))
      .returns(
        resolveOk({
          notifyUpdate: true,
          latestVersion: "2.1.0",
          forceUpdate: false,
          features: [],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: true,
        latestVersion: "2.1.0",
        forceUpdate: false,
        features: [],
      },
    });
  });

  it("should respond with update notification and force update for a feature-specific version", async () => {
    req.body.versionName = "2.1.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '2.1.0' }))
      .returns(
        resolveOk({
          notifyUpdate: true,
          latestVersion: "3.1.1",
          forceUpdate: true,
          features: ['profile'],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: true,
        latestVersion: "3.1.1",
        forceUpdate: true,
        features: ['profile'],
      },
    });
  });

  it("should respond with no update for a feature-specific version when no update is needed", async () => {
    req.body.versionName = "3.1.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '3.1.0' }))
      .returns(
        resolveOk({
          notifyUpdate: false,
          latestVersion: "3.1.0",
          forceUpdate: false,
          features: [],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: false,
        latestVersion: "3.1.0",
        forceUpdate: false,
        features: [],
      },
    });
  });

  it("should respond with update notification for another feature when user is on a feature-specific version", async () => {
    req.body.versionName = "2.1.0";
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '2.1.0' }))
      .returns(
        resolveOk({
          notifyUpdate: true,
          latestVersion: "3.1.1",
          forceUpdate: false,
          features: ['/profile', '/videoContent'],
        })
      );

    const response = await TestRoutes.execute("/app-version", "Post", req, res);

    expect(response).to.eql({
      status: true,
      message: "Successfully got app version!",
      entity: {
        notifyUpdate: true,
        latestVersion: "3.1.1",
        forceUpdate: false,
        features: ['/profile', '/videoContent'],
      },
    });
  });

});

context('Error Cases', () => {
  it("should respond with failure when some error occurs", async () => {
    sandbox
      .mock(checkVersionService)
      .expects("perform")
      .withArgs(sinon.match({ os: 'android', versionName: '2.1.0' }))
      .returns(resolveError("some error occurred"));

    const response = await TestRoutes.executeWithError("/app-version", "Post", req, res);
    expect(response).to.eql({
      code: 500,
      errorMessage: "Failed to get app version!",
      errorDescription: "Internal Server Error",
      error: "some error occurred",
    });
  });

});
  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
