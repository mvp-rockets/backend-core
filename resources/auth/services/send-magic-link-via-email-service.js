const NotificationHandler = require('notifications/notification-handler');

module.exports.send = async ({ to, theme, url }) => {

    const { host } = new URL(url)
    const brandColor = theme.brandColor || "#346df1";

    return NotificationHandler.send({
        context: "loginMagicLink",
        modes: [{ name: "email", to }],
        data: {
            background: "#f9f9f9",
            text: "#444",
            mainBackground: "#fff",
            buttonBackground: brandColor,
            buttonBorder: brandColor,
            buttonText: theme.buttonText || "#fff",
            escapedHost: host.replace(/\./g, "&#8203;."),
            url
        },
    })
}