const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'jurgenklopp.testiti@gmail.com',
            subject: 'Welcome to Task Management Dovla App!',
            html: `Welcome to the app <strong style="color: red;">${name}</strong>. Let us know haw you get along with the app`
        })
    } catch
        (e) {
        console.log(error.response.body.errors[0].message)
    }
}

const sendCancelEmail = async (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'jurgenklopp.testiti@gmail.com',
            subject: 'good bye',
            html: `We are very sorry that you are canceling our service <strong style="color: red;">${name}</strong>, can you at least tel us why?`
        })
    } catch
        (e) {
        console.log(error.response.body.errors[0].message)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}