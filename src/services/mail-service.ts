import { Resend } from 'resend';
import nodeMailer from 'nodemailer';
import { ServerConfig } from '../config';
import { AppError } from '../utils/errors';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../utils/commons';
import { Enums } from '../utils/constants';

class MailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(ServerConfig.RESEND.EMAIL_SERVICE_API_KEY);
    }

    public async sendEmailByResend(to: string[], subject: string, text: string) {
        try {
            const { error } = await this.resend.emails.send({
                from: `Shani Sharma <onboarding@resend.dev>`,
                to,
                subject,
                text,
            });

            if (error) {
                throw new AppError(error.message, StatusCodes.UNPROCESSABLE_ENTITY);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
        }
    }

    public async sendEmailByNodeMailer(to: string, subject: string, html: string) {
        try {
            const transporter = nodeMailer.createTransport({
                host: ServerConfig.SMTP.MAIL_HOST,
                service: ServerConfig.SMTP.MAIL_SERVICE,
                auth: {
                    user: ServerConfig.SMTP.MAIL_USERNAME,
                    pass: ServerConfig.SMTP.MAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: `Shani Sharma <${ServerConfig.SMTP.MAIL_USERNAME}>`,
                to: to,
                subject: subject,
                html: html,
            };

            transporter.sendMail(mailOptions, (error: Error | null) => {
                Logger.error(Enums.EApplicationEvents.EMAIL_SERVICE_ERROR, {
                    meta: error,
                });
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
        }
    }
}

export default MailService;
