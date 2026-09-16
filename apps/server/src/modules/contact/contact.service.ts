import { ENV } from '../../config/env';
import { sendEmail, generateContactEmailHtml } from '../../utils/brevo';

export class ContactService {
  async submitContactForm(data: { name: string; email: string; message: string }) {
    const html = generateContactEmailHtml(data.name, data.email, data.message);

    const sent = await sendEmail({
      toEmail: ENV.CONTACT_RECEIVER_EMAIL,
      toName: 'Vaibhav Soni',
      replyToEmail: data.email,
      replyToName: data.name,
      subject: `New Zync Contact Message from ${data.name}`,
      htmlContent: html
    });

    if (!sent && ENV.BREVO_API_KEY) {
      const err: any = new Error('Failed to dispatch contact email. Please try again later.');
      err.statusCode = 502;
      throw err;
    }

    return { message: 'Thank you for reaching out! Your message has been sent to Vaibhav Soni.' };
  }
}

export const contactService = new ContactService();
