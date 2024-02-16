module.exports.generate = async () => {
    const { generateHOTP } = await import("oslo/otp");
    const { HMAC } = await import("oslo/crypto");

    const secret = await new HMAC("SHA-1").generateKey();

    const otp = await generateHOTP(secret, 0);
    if (process.env.NODE_ENV == 'dev') {
        console.log('OTP: ', otp)
    }
    return otp;
}