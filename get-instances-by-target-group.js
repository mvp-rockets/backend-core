#!/usr/bin/env node
const AWS = require('aws-sdk');

const perform = async () => {
    const params = {
        TargetGroupArn: process.env.AWS_EC2_TARGET_GROUP_ARN
    };
    const elbv2 = new AWS.ELBv2();
    elbv2.describeTargetHealth(params, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const targetIds = data.TargetHealthDescriptions.map((x) => x.Target.Id);
        if (targetIds && targetIds.length) {
            const ec2 = new AWS.EC2();
            ec2.describeInstances({ InstanceIds: targetIds }, (err, instanceDetails) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                const publicIpAddress = [];
                instanceDetails.Reservations.forEach((reservation) => {
                    reservation.Instances.forEach((instance) => {
                        const instanceVal = mode == "instance" ? instance.InstanceId : instance.PublicIpAddress;
                        console.log(instanceVal);
                        publicIpAddress.push(instanceVal);
                    });
                });
                if (!publicIpAddress.length) {
                    console.error("No instances found mapped to TargetGroups");
                    process.exit(1);
                }
            });
        } else {
            console.error("No TargetGroups found");
            process.exit(1);
        }
    });
};

let mode = "instance";
if (process.argv.length > 2 && process.argv[2] === "ip") {
  mode = "ip"; 
}

if (process.env.APP_ENV == "vagrant") {
    ['192.168.56.20', '192.168.56.30'].map((ip) => console.log(ip));

    process.exit(0);
}

if (!process.env.AWS_EC2_TARGET_GROUP_ARN) {
    console.error("Missing AWS_EC2_TARGET_GROUP_ARN");
    process.exit(1);
}

perform(mode);

