import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { contactService } from './contact.service';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

export class ContactController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = contactSchema.parse(req.body);
      const result = await contactService.submitContactForm(validated);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
