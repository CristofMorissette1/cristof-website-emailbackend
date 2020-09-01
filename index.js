const express = require("express")
const bodyParser = require("body-parser")
const nodeMailer = require("nodemailer")
const app = express()
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))



app.post('/api/form', (req, res) => {
    nodeMailer.createTestAccount((err, account) => {
        const htmlEmail = `
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
        `
        var transporter = nodeMailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
            ciphers:'SSLv3'
            },
            requireTLS:true,//this parameter solved problem for me
            auth: {
            user: 'cristofmorissette@hotmail.com',
            pass: 'Ihatestorms1!'
            }
            });

        let mailOptions = {
            from: req.body.email,
            to: "cristofmorissette@hotmail.com",
            replyTo: req.body.email,
            text: req.body.message,
            html: htmlEmail
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err)
            }

            console.log('Message sent: %s', info.response)
            console.log('Message URL: %s', nodeMailer.getTestMessageUrl(info))
        })
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})