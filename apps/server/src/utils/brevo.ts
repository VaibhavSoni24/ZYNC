import { ENV } from '../config/env';
import { logger } from './logger';

export interface SendEmailOptions {
  toEmail: string;
  toName?: string;
  replyToEmail?: string;
  replyToName?: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({
  toEmail,
  toName,
  replyToEmail,
  replyToName,
  subject,
  htmlContent
}: SendEmailOptions): Promise<boolean> {
  if (!ENV.BREVO_API_KEY) {
    logger.info(`[DEV_MODE - EMAIL SIMULATOR] To: ${toEmail} | Subject: ${subject}`);
    logger.info(`[DEV_MODE - EMAIL CONTENT]\n${htmlContent.replace(/<[^>]*>?/gm, ' ').trim()}`);
    return true;
  }

  try {
    const payload: any = {
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
    };

    if (replyToEmail) {
      payload.replyTo = {
        email: replyToEmail,
        name: replyToName || replyToEmail
      };
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': ENV.BREVO_API_KEY
      },
      body: JSON.stringify(payload)
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

        <div style="margin: 26px auto; text-align: center;">
          <div style="display: inline-block; max-width: 100%; box-sizing: border-box; letter-spacing: 6px; text-indent: 6px; font-size: 30px; font-weight: 800; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #3B82F6; background-color: #12121E; padding: 14px 28px; border-radius: 10px; border: 1.5px dashed #3B82F6; white-space: nowrap; word-break: keep-all; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);">
            ${otp}
          </div>
        </div>

        <p style="color: #8B8B9E; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
          This code will expire in <strong style="color: #F5F5FA;">10 minutes</strong>. If you did not request this verification code, please ignore this email.
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0A0A12; color: #F5F5FA; border-radius: 16px; padding: 32px; border: 1px solid #26263A;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FFFFFF; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Zync</h1>
        <p style="color: #2E7CF6; font-size: 13px; font-weight: 600; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">New Direct Contact Form Submission</p>
      </div>

      <div style="background-color: #14141F; border-radius: 12px; padding: 24px; border: 1px solid #26263A;">
        <div style="margin-bottom: 14px;">
          <span style="font-size: 12px; color: #8B8B9E; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 4px;">From</span>
          <span style="font-size: 16px; color: #FFFFFF; font-weight: 600;">${name}</span>
        </div>

        <div style="margin-bottom: 20px;">
          <span style="font-size: 12px; color: #8B8B9E; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 4px;">Email</span>
          <a href="mailto:${email}" style="font-size: 15px; color: #2E7CF6; text-decoration: none; font-weight: 500;">${email}</a>
        </div>

        <div style="border-top: 1px solid #26263A; padding-top: 16px;">
          <span style="font-size: 12px; color: #8B8B9E; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: block; margin-bottom: 8px;">Message</span>
          <div style="background-color: #1C1C29; padding: 18px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #F5F5FA; border-left: 3px solid #9B3CFF; white-space: pre-wrap;">
${message}
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #5B5B6E; font-size: 12px;">
        Hit "Reply" in your email client to respond directly to ${name} (${email}).
      </div>
    </div>
  `;
}

export function generatePasswordResetOtpEmailHtml(otp: string, username: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0A0A12; color: #F5F5FA; border-radius: 16px; padding: 32px; border: 1px solid #26263A;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FFFFFF; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Zync</h1>
        <p style="color: #60A5FA; font-size: 13px; font-weight: 600; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Password Reset Request</p>
      </div>

      <div style="background-color: #14141F; border-radius: 12px; padding: 24px; border: 1px solid #26263A; text-align: center;">
        <p style="color: #F5F5FA; font-size: 16px; margin-top: 0;">Hi <strong>${username}</strong>,</p>
        <p style="color: #8B8B9E; font-size: 14px; line-height: 1.5;">
          We received a request to reset the password for your Zync account. Use the one-time verification code below to set your new password:
        </p>

        <div style="margin: 26px auto; text-align: center;">
          <div style="display: inline-block; max-width: 100%; box-sizing: border-box; letter-spacing: 6px; text-indent: 6px; font-size: 32px; font-weight: 800; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #60A5FA; background-color: #12121E; padding: 14px 28px; border-radius: 12px; border: 1.5px dashed #3B82F6; white-space: nowrap; word-break: keep-all; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.25);">
            ${otp}
          </div>
        </div>

        <p style="color: #F87171; font-size: 12px; line-height: 1.5; margin-bottom: 8px; font-weight: 500;">
          ⚠️ This code expires in 10 minutes.
        </p>
        <p style="color: #71717A; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          If you didn't ask to reset your password, you can safely ignore this email — your account remains secure.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #52525B; font-size: 11px;">
        &copy; ${new Date().getFullYear()} Zync Inc. End-to-End Synchronized Theater Protocol.
      </div>
    </div>
  `;
}

export function generateAccountDeletionOtpEmailHtml(otp: string, username: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #0A0A12; color: #F5F5FA; border-radius: 16px; padding: 32px; border: 1px solid #7F1D1D;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #EF4444; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Zync</h1>
        <p style="color: #F87171; font-size: 13px; font-weight: 600; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Account Deletion Verification</p>
      </div>

      <div style="background-color: #1A1115; border-radius: 12px; padding: 24px; border: 1px solid #991B1B; text-align: center;">
        <p style="color: #F5F5FA; font-size: 16px; margin-top: 0;">Hi <strong>${username}</strong>,</p>
        <p style="color: #FCA5A5; font-size: 14px; line-height: 1.5;">
          A request was initiated to <strong>permanently delete</strong> your Zync account and wipe all personal data and hosted watch parties.
        </p>

        <div style="margin: 26px auto; text-align: center;">
          <div style="display: inline-block; max-width: 100%; box-sizing: border-box; letter-spacing: 6px; text-indent: 6px; font-size: 32px; font-weight: 800; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; color: #EF4444; background-color: #261114; padding: 14px 28px; border-radius: 12px; border: 1.5px dashed #EF4444; white-space: nowrap; word-break: keep-all; box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);">
            ${otp}
          </div>
        </div>

        <p style="color: #EF4444; font-size: 12px; line-height: 1.5; margin-bottom: 8px; font-weight: 600;">
          ⚠️ THIS ACTION CANNOT BE UNDONE.
        </p>
        <p style="color: #A1A1AA; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          If you did not request to delete your account, please change your password immediately.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #52525B; font-size: 11px;">
        &copy; ${new Date().getFullYear()} Zync Inc. Danger Zone Protocol.
      </div>
    </div>
  `;
}

