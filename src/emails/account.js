const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'ahmet.alkan00@icloud.com',
        subject: 'Welcome to task Manager',
        text: `Welcome to the app, ${name}, let me now how you get along with it`
    })
}

const sendCancelationEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'ahmet.alkan00@icloud.com',
        subject: 'Your Account has been cancelled',
        text: `Sorry to see you go ${name},`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}