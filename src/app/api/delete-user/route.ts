import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário não fornecido.' }, { status: 400 })
    }

    // Inicializa o cliente do Supabase com a chave de serviço (Service Role Key) para poder deletar o usuário
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Deleta o usuário do Auth do Supabase
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Conta excluída com sucesso.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir conta.' }, { status: 500 })
  }
}