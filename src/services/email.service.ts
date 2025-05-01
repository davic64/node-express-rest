import { Resend } from 'resend';

import config from '../config/config';

const resend = new Resend(config.RESEND_API_KEY);

const resendMail = (from: string, to: string, subject: string, html: string) => {
  resend.emails.send({
    from,
    to,
    subject,
    html,
  });
};

/**
 * Send email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<void>}
 */
const sendEmail = async (to: string, subject: string, html: string) => {
  const mail = { from: config.MAIL_FROM, to, subject, html };
  await resend.emails.send(mail);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://front/reset-password?token=${token}`;
  const html = `
    <div>
      <h1>Reset password</h1>
      <p>Click on the link below to reset your password</p>
      <a href="${resetPasswordUrl}">Reset password</a>
    </div>
  `;
  await sendEmail(to, subject, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://front/verify-email?token=${token}`;
  const html = `
    <div>
      <h1>Email Verification</h1>
      <p>Click on the link below to verify your email</p>
      <a href="${verificationEmailUrl}">Verify email</a>
    </div>
  `;
  await sendEmail(to, subject, html);
};

export default {
  resendMail,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
