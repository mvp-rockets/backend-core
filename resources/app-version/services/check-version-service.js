const Result = require('folktale/result');

const verifyVersion = ({ versionName, config, os }) => {
    const versionKey = 'appVersions';

    const minVersionOnServer = os === 'android' ? config[versionKey].minAndroidVersionName : config[versionKey].minIosVersionName;
    const latestVersionOnServer = os === 'android' ? config[versionKey].latestVersionOfAndroid : config[versionKey].latestVersionOfIos;

    if (versionName === minVersionOnServer && latestVersionOnServer) {
        return {
            notifyUpdate: true,
            latestVersion: latestVersionOnServer,
            forceUpdate: true,
            features: Object.values(config[versionKey]?.featuresUpdate || {}).map(featureInfo => featureInfo.path),
        };
    }
    // Check if the user version is older than the latest version
    if (latestVersionOnServer) {
        const [serverMajorVersion, serverMinorVersion] = latestVersionOnServer.split('.').map(val => Number(val));
        const [majorVersion, minorVersion] = versionName.split('.').map(val => Number(val));

        if (serverMajorVersion > majorVersion || (serverMajorVersion === majorVersion && serverMinorVersion > minorVersion)) {
         const featureVersions = Object.entries(config[versionKey]?.featuresUpdate ?? {})
         .filter(([feature, featureInfo]) => featureInfo?.version > versionName)
          .map(([feature, featureInfo]) => featureInfo?.path);
            return {
                notifyUpdate: true,
                latestVersion: latestVersionOnServer,
                forceUpdate: false,
                features: featureVersions,
            };
        }
    }
    return {
        notifyUpdate: false,
        latestVersion: latestVersionOnServer,
        forceUpdate: false,
        features: [],
    };
};

const updateAppVersion = ({ os, versionName, config }) => {
    const versionKey = 'appVersions';
    const latestVersionOnServer = os === 'android' ? config[versionKey].latestVersionOfAndroid : config[versionKey].latestVersionOfIos;
    const minVersionOnServer = os === 'android' ? config[versionKey].minAndroidVersionName : config[versionKey].minIosVersionName;

    if (latestVersionOnServer) {
        const result = verifyVersion({ versionName, config, os });
        return Result.Ok(result);
    } else {
        return Result.Ok({
            notifyUpdate: false,
            latestVersion: latestVersionOnServer ? latestVersionOnServer : minVersionOnServer, 
            forceUpdate: false,
            features: [],
        });
    }
};
module.exports.perform = async ({ os, versionName, config }) => updateAppVersion({ os, versionName, config });