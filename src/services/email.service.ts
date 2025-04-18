import { SendMailOptions } from '~/dto/res/email/emailOption.res'
import { renderEmailTemplate } from '~/utils/email'
import { Resend } from 'resend'
import { env } from 'process'
import { SendVerifyMailOptions } from '~/dto/res/email/verifyEmail.res'
import { signEmailVerificationToken } from '~/utils/jwt'

const resend = new Resend(env.RESEND_API_KEY)

export const sendEmail = async ({ to, subject, template, variables = {} }: SendMailOptions) => {
  const html = await renderEmailTemplate(template, variables)
  const fromEmail = `Vocab App <${process.env.FROM_EMAIL}>`

  const { error } = await resend.emails.send({ from: fromEmail, to, subject, html })

  if (error) throw error
}

export const sendVerifyEmail = async ({
  to,
  subject = 'Please verify email for Astro Vocab Website!',
  template,
  body
}: SendVerifyMailOptions) => {
  // create verify email token
  const token = await signEmailVerificationToken({ userId: body.userId })

  // create link verify email
  const fe_url = env.FE_URL
  const verifyUrl = `${fe_url}/verify-email?token=${token}`

  await sendEmail({ to, subject, template, variables: { verifyUrl, name: body.name } })
  return verifyUrl
}
