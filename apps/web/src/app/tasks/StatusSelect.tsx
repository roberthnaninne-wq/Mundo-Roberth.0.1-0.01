'use client'

import { useState } from 'react'
import { updateTaskStatus } from './actions'
import { CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react'

export default function TaskStatusSelect({ taskId, currentStatus }: { taskId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return
    setLoading(true)
    const result = await updateTaskStatus(taskId, newStatus)
    if (result.success) {
      setStatus(newStatus)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1">
      {loading ? (
        <Loader2 size={16} className="animate-spin text-primary" />
      ) : (
        <div className="flex gap-2">
          <button 
            onClick={() => handleUpdate('pending')}
            className={`p-1.5 rounded-lg transition-all ${status === 'pending' ? 'bg-primary/20 text-primary' : 'text-zinc-600 hover:text-primary'}`}
            title="Pendente"
          >
            <Circle size={14} />
          </button>
          <button 
            onClick={() => handleUpdate('completed')}
            className={`p-1.5 rounded-lg transition-all ${status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-600 hover:text-emerald-500'}`}
            title="Concluir"
          >
            <CheckCircle2 size={14} />
          </button>
          <button 
            onClick={() => handleUpdate('cancelled')}
            className={`p-1.5 rounded-lg transition-all ${status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'text-zinc-600 hover:text-red-500'}`}
            title="Cancelar"
          >
            <XCircle size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
