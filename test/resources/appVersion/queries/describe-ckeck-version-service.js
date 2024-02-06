const chai = require("chai");
const expect = chai.expect;
const { verifyResultOk, verifyResultError } = require("helpers/verifiers.js");
const CheckVersionService = require('resources/app-version/services/check-version-service');

describe.only('Check Version Service', () => {
    let versionData;

    beforeEach(() => {
        versionData = {
            versionName: "1.9.0",
            os: "android",
            config: {
              appVersions: {
                minAndroidVersionName: '1.9.0',
                minIosVersionName: '2.1.0',
                latestVersionOfAndroid: undefined, 
                latestVersionOfIos: undefined,
                featuresUpdate: {
                    home: {
                        version: '2.1.0',
                        path: '/home',
                    },
                    login: {
                        version: '2.1.0',
                        path: '/login',
                    },
                    musicContent: {
                        version: '1.9.0',
                        path: '/music',
                    },
                  
                },   
              },
              
            },
        };
    });

    it('should respond with no update when user is on the latest version', async () => {
        versionData.versionName = '3.1.0';
        versionData.config.appVersions.latestVersionOfAndroid = '3.1.0';
        const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
        verifyResultOk((result) => {
            expect(result.notifyUpdate).to.equal(false);
            expect(result.latestVersion).to.equal(versionData.versionName);
            expect(result.forceUpdate).to.equal(false);
            expect(result.features).to.eql([]);
        })(checkVersionServiceResponse);
    });

    it('should respond with no update when user is on the minimum version and the latest version is not released', async () => {
        const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
        verifyResultOk((result) => {
            expect(result.notifyUpdate).to.equal(false);
            expect(result.latestVersion).to.equal(versionData.versionName);
            expect(result.forceUpdate).to.equal(false);
            expect(result.features).to.eql([]);
        })(checkVersionServiceResponse);
    });

    it('should respond with update notification and force update when user is on minimum version and a newer version is available', async () => {
        versionData.config.appVersions.latestVersionOfAndroid = '3.1.0';
        const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
        verifyResultOk((result) => {
            expect(result.notifyUpdate).to.equal(true);
            expect(result.latestVersion).to.equal(versionData.config.appVersions.latestVersionOfAndroid);
            expect(result.forceUpdate).to.equal(true);
            expect(result.features).to.eql([
            "/home",
            "/login",
            "/music"
            ]);
        })(checkVersionServiceResponse);
    });

    it('should respond with update notification without forcing when user is on an older version than the latest', async () => {
        versionData.config.appVersions.latestVersionOfAndroid = '3.1.0';
        versionData.versionName = '2.1.0';
        const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
        verifyResultOk((result) => {
            expect(result.notifyUpdate).to.equal(true);
            expect(result.latestVersion).to.equal(versionData.config.appVersions.latestVersionOfAndroid);
            expect(result.forceUpdate).to.equal(false);
            expect(result.features).to.eql([
            ]);
        })(checkVersionServiceResponse);
    });

    it('should respond with update notification for a specific feature version', async () => {
        versionData.config.appVersions.latestVersionOfAndroid = '3.1.0';
        versionData.versionName = '2.0.0';
        const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
        verifyResultOk((result) => {
            expect(result.notifyUpdate).to.equal(true);
            expect(result.latestVersion).to.equal(versionData.config.appVersions.latestVersionOfAndroid);
            expect(result.forceUpdate).to.equal(false);
            expect(result.features).to.eql([ 
            "/home",
            "/login",
        ]);
        })(checkVersionServiceResponse);
    });

    afterEach(() => {
    });
});
