import { ENV } from '../../config/env';
import { sendEmail, generateContactEmailHtml } from '../../utils/brevo';

export class ContactService {
  async submitContactForm(data: { name: string; email: string; message: string }) {
    const html = generateContactEmailHtml(data.name, data.email, data.message);

    await sendEmail({
      toEmail: ENV.CONTACT_RECEIVER_EMAIL,
      toName: 'Vaibhav Soni',
      subject: `New Zync Inquiry from ${data.name}`,
      htmlContent: html
    });

    return { message: 'Thank you for reaching out! Your message has been dispatched to Vaibhav.' };
  }
}

export const contactService = new ContactService();
