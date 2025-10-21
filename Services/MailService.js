require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const RendezvousRepository = require('./../Repositories/RendezvousRepository');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('\n---****++++----****+++++\nError while sending email:\n', error);
        }
        console.log('Email sent successfully:', info.response);
    });
}

exports.autoMails = () => {

    let usersBlocked = [];
        const now2 = new Date();
        console.log('\n-------------------------\nChecking for rendezvous to notify at:', now2);

    cron.schedule('0 * * * *', async () => {
        const now = new Date();
        const next24h = new Date(now.getTime() + 86400000);// 24h =>86 400 000 ms

        try {
            console.log('\n------------***-------------\nnow:', now);
            console.log('\n------------***-------------\nnext 24h:', next24h);
            const rendezvous = await RendezvousRepository.whoHasRendezAfter24And25();

            // rendezvous.forEach((rendez) => {
            //     sendEmail(
            // });
            console.log('****\n', rendezvous);
            for (const rendez of rendezvous) {
                if (rendez.patient[0].status == 'suspended'){
                    usersBlocked.push(rendez.patient[0]);
                    continue;
                }
                console.log('****\n', rendez);
                exports.sendEmail(
                    rendez.patient[0].email,
                    'Rappel de rendez-vous',
                    `Name: ${rendez.patient[0].firstName} ${rendez.patient[0].lastName}Cher patient,\n\nCeci est un rappel que vous avez un rendez-vous prévu le ${rendez.dateStar}.\n\nMerci de votre attention.\n\nCordialement,\nL'équipe de soins`
                );
            }
            // if(usersBlocked.length > 0) throw new Error(usersBlocked); use Winston or Morgan for logs

        } catch (error) {
            throw new Error(error);
        }
    });
}

