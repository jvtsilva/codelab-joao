'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name?: string
  email: string
  xp: number
  streak: number
}

interface LeaderboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [ranking, setRanking] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchRanking()
    }
  }, [isOpen])

  const fetchRanking = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('xp', { ascending: false })
      .limit(10) // Pega o Top 10

    if (data && !error) {
      setRanking(data)
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            🏆 Ranking de XP
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 font-medium">Carregando o ranking...</div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {ranking.map((user, index) => {
              let medal = ''
              if (index === 0) medal = '🥇'
              else if (index === 1) medal = '🥈'
              else if (index === 2) medal = '🥉'
              else medal = `${index + 1}º`

              return (
                <div 
                  key={user.id}
                  className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-black text-lg text-slate-300">{medal}</span>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm truncate max-w-[180px]">
                        {user.full_name || user.email.split('@')[0]}
                      </h4>
                      <span className="text-xs text-orange-400">🔥 {user.streak} dias de ofensa</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 font-black text-amber-400 text-sm">
                    {user.xp} XP
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700 cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}