import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'E-mail não fornecido' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Codelab <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirme sua conta no Codelab',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Bem-vindo ao Codelab!</h2>
          <p>Sua conta foi criada com sucesso.</p>
          <p>Acesse o sistema e comece sua jornada.</p>
        </div>
      `,
    })

    //erro
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno ao enviar e-mail' }, { status: 500 })
  }
}