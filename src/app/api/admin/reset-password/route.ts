import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email, newPassword, adminSecret } = await request.json()

    if (adminSecret !== 'joao123codelab') {
      return NextResponse.json({ error: 'Senha mestra do admin inválida!' }, { status: 401 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const targetUser = usersData.users.find((u) => u.email === email)

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado com esse e-mail.' }, { status: 404 })
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    )

    if (updateError) throw updateError

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso!' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao alterar senha.' }, { status: 500 })
  }
}