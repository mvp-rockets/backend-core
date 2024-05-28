const chai = require("chai");
const expect = chai.expect;
const { verifyResultOk, verifyResultError } = require("helpers/verifiers.js");
const CheckVersionService = require('resources/app-versions/services/check-customer-version-service');

describe('Check Version Service', () => {
    let versionData;

    beforeEach(() => {
        versionData = {
            versionName: "1.9.0",
            os: "android",
            config: {
                customerAppVersions: {
                    minAndroidVersionName: '1.9.0',
                    minIosVersionName: '1.9.0',
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

    context('success updated for version android', () => {
        it('should respond with no update when user is on the latest version', async () => {
            versionData.versionName = '3.1.0';
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
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
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(true);
                expect(result.features).to.eql([
                    "/home",
                    "/login",
                    "/music"
                ]);
            })(checkVersionServiceResponse);
        });
        it('should respond with  update notification and force update when user version lesser than min version and latest version available', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.config.customerAppVersions.minAndroidVersionName = '3.1.0';
            versionData.versionName = '2.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(true);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });
        it('should respond with update notification without forcing when user is on an older version than the latest', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.versionName = '2.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification for a specific feature version', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.versionName = '2.0.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([
                    "/home",
                    "/login",
                ]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when latest version is undefined', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = undefined;
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when user version is the latest version', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.versionName = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when featuresUpdate is undefined', async () => {
            versionData.config.customerAppVersions.featuresUpdate = undefined;
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when featuresUpdate is an empty object', async () => {
            versionData.config.customerAppVersions.featuresUpdate = {};
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification and force update when user is on minimum version and latest version exists with empty features', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.config.customerAppVersions.featuresUpdate = {};
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(true);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification without forcing when user version is older than the latest and latest version exists with empty features', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.versionName = '2.0.0';
            versionData.config.customerAppVersions.featuresUpdate = {};
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });


        it('should respond with no update notification when user on latest version and latest version available', async () => {
            versionData.config.customerAppVersions.latestVersionOfAndroid = '3.1.0';
            versionData.versionName = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfAndroid);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

    })

    context('sucess updated for version ios', () => {
        it('should respond with no update when user is on the latest version (iOS)', async () => {
            versionData.os = "ios";
            versionData.versionName = '3.1.0';
            versionData.config.customerAppVersions.latestVersionOfIos = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when user is on the minimum version and the latest version is not released (iOS)', async () => {
            versionData.os = "ios";
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification and force update when user is on minimum version and a newer version is available (iOS)', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.latestVersionOfIos = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfIos);
                expect(result.forceUpdate).to.equal(true);
                expect(result.features).to.eql([
                    "/home",
                    "/login",
                    "/music"
                ]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when featuresUpdate is undefined', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.featuresUpdate = undefined;
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.versionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when featuresUpdate is an empty object', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.featuresUpdate = {};

            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.minIosVersionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update when user on minmum version and latest version is not released', async () => {
            versionData.os = "ios";
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.minIosVersionName);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification and force update when user is on minimum version and latest version exists with empty features', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.latestVersionOfIos = '3.1.0';
            versionData.config.customerAppVersions.featuresUpdate = {};
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfIos);
                expect(result.forceUpdate).to.equal(true);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with update notification without forcing when user version is older than the latest and latest version exists with empty features', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.latestVersionOfIos = '3.1.0';
            versionData.versionName = '2.0.0';
            versionData.config.customerAppVersions.featuresUpdate = {};
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(true);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfIos);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });

        it('should respond with no update notification when user on latest version and latest version available', async () => {
            versionData.os = "ios";
            versionData.config.customerAppVersions.latestVersionOfIos = '3.1.0';
            versionData.versionName = '3.1.0';
            const checkVersionServiceResponse = await CheckVersionService.perform(versionData);
            verifyResultOk((result) => {
                expect(result.notifyUpdate).to.equal(false);
                expect(result.latestVersion).to.equal(versionData.config.customerAppVersions.latestVersionOfIos);
                expect(result.forceUpdate).to.equal(false);
                expect(result.features).to.eql([]);
            })(checkVersionServiceResponse);
        });
    })

    afterEach(() => {
    });
});
