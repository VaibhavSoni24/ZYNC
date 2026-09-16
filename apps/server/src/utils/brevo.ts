import { ENV } from '../config/env';
import { logger } from './logger';

export interface SendEmailOptions {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ toEmail, toName, subject, htmlContent }: SendEmailOptions): Promise<boolean> {
  if (!ENV.BREVO_API_KEY) {
    logger.info(`[DEV_MODE - EMAIL SIMULATOR] To: ${toEmail} | Subject: ${subject}`);
    logger.info(`[DEV_MODE - EMAIL CONTENT]\n${htmlContent.replace(/<[^>]*>?/gm, ' ').trim()}`);
    return true;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': ENV.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: ENV.BREVO_SENDER_NAME,
          email: ENV.BREVO_SENDER_EMAIL
        },
        to: [
          {
            email: toEmail,
            name: toName || toEmail
          }
        ],
        subject,
        htmlContent
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error('Brevo email API error response:', response.status, errorBody);
      return false;
    }

    logger.info(`Email successfully dispatched via Brevo to ${toEmail}`);
    return true;
  } catch (error: any) {
    logger.error('Failed to send email via Brevo:', error.message);
    return false;
  }
}

export function generateOtpEmailHtml(otp: string, username: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0A0A12; color: #F5F5FA; border-radius: 12px; padding: 32px; border: 1px solid #26263A;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FFFFFF; font-size: 28px; margin: 0; font-weight: 700;">Zync</h1>
        <p style="color: #8B8B9E; font-size: 14px; margin-top: 6px;">Watch Together, Perfectly In Sync</p>
      </div>

      <div style="background-color: #14141F; border-radius: 8px; padding: 24px; border: 1px solid #26263A; text-align: center;">
        <p style="color: #F5F5FA; font-size: 16px; margin-top: 0;">Hi <strong>${username}</strong>,</p>
        <p style="color: #8B8B9E; font-size: 14px;">Use the verification code below to complete your Zync account registration:</p>

        <div style="margin: 28px 0; letter-spacing: 8px; font-size: 36px; font-weight: 800; color: #2E7CF6; background-color: #1C1C29; padding: 14px 20px; border-radius: 8px; border: 1px dashed #2E7CF6; display: inline-block;">
          ${otp}
        </div>

        <p style="color: #8B8B9E; font-size: 12px; margin-bottom: 0;">
          This code will expire in <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #5B5B6E; font-size: 11px;">
        &copy; ${new Date().getFullYear()} Zync. All rights reserved.
      </div>
    </div>
  `;
}

export function generateContactEmailHtml(name: string, email: string, message: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; background-color: #0A0A12; color: #F5F5FA; border-radius: 12px; padding: 32px; border: 1px solid #26263A;">
      <h2 style="color: #2E7CF6; margin-top: 0;">New Message from Zync Contact Form</h2>
      <div style="background-color: #14141F; border-radius: 8px; padding: 20px; border: 1px solid #26263A;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #1C1C29; padding: 16px; border-radius: 6px; white-space: pre-wrap; color: #E2E8F0;">
          ${message}
        </div>
      </div>
    </div>
  `;
}
