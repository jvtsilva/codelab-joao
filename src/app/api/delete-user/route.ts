import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário não fornecido.' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    // Deleta os registros das tabelas associadas ao usuário no banco
    await supabaseAdmin.from('user_progress').delete().eq('user_id', userId)
    await supabaseAdmin.from('user_challenges').delete().eq('user_id', userId)

    // Deleta o usuário do Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Conta e dados excluídos com sucesso.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir conta.' }, { status: 500 })
  }
}