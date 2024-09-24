import { Resend } from 'resend';
import { ServerConfig } from '../config';
import AppError from '../utils/errors/app-error';
import { StatusCodes } from 'http-status-codes';

class MailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(ServerConfig.EMAIL_SERVICE_API_KEY);
    }

    public async sendEmail(to: string[], subject: string, text: string) {
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
            if (error instanceof AppError) throw new AppError(error.message, error.statusCode, error.data);
        }
    }
}

export default MailService;
