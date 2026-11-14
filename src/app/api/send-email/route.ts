import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, confirmationUrl } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'E-mail não fornecido' }, { status: 400 })
    }

    // Link de fallback caso venha vazio, mas o ideal é vir do Supabase/Front
    const linkParaConfirmar = confirmationUrl || '#'

    const { data, error } = await resend.emails.send({
      from: 'Codelab <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirme sua conta no Codelab',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Bem-vindo ao Codelab!</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">
            Sua conta foi criada com sucesso. Para começar sua jornada e ativar o seu acesso à plataforma, clique no botão abaixo:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${linkParaConfirmar}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 15px;">
              Confirmar e acessar
            </a>
          </div>
          <p style="font-size: 13px; color: #9ca3af; line-height: 1.4;">
            Se você não solicitou este cadastro, pode ignorar este e-mail com segurança.
          </p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno ao enviar e-mail' }, { status: 500 })
  }
}