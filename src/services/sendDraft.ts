import fs from 'fs/promises';
import path from 'path';
import { Resend } from 'resend';

// Writes the draft_post to trend_results.txt in the project root and sends it via Resend email
export async function sendDraft(draft_post: string) {
  const filePath = path.resolve(__dirname, '../../trend_results.txt');
  let fileResult = '';
  let emailResult = '';
  try {
    await fs.writeFile(filePath, draft_post, 'utf-8');
    fileResult = `Draft written to ${filePath}`;
  } catch (error) {
    fileResult = 'Error writing draft to file: ' + error;
    console.error(fileResult);
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailFrom = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev';
    const emailTo = process.env.RESEND_EMAIL_TO;
    if (!emailTo) {
      emailResult = 'RESEND_EMAIL_TO not set. Skipping email.';
      console.warn(emailResult);
    } else {
      const response = await resend.emails.send({
        from: emailFrom,
        to: emailTo,
        subject: 'Trend Finder Results',
        text: draft_post,
      });
      if (response.error) {
        emailResult = 'Error sending email via Resend: ' + response.error;
        console.error(emailResult);
      } else {
        emailResult = 'Draft sent via Resend to ' + emailTo;
        console.log(emailResult);
      }
    }
  } catch (error) {
    emailResult = 'Error sending email via Resend: ' + error;
    console.error(emailResult);
  }

  return fileResult + '\n' + emailResult;
}