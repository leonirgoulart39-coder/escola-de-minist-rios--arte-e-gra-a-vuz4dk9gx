import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function InstallmentFormModal({ isOpen, onClose, onSuccess }: any) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])

  const [formData, setFormData] = useState({
    total_amount: '',
    installments_count: '1',
    payment_method: 'PIX',
    student_id: '',
    class_id: '',
    first_due_date: new Date().toISOString().split('T')[0],
  })

  const [preview, setPreview] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('students')
      .select('id, name')
      .then(({ data }) => setStudents(data || []))
    supabase
      .from('classes')
      .select('id, name')
      .then(({ data }) => setClasses(data || []))
  }, [])

  useEffect(() => {
    if (isOpen) {
      setFormData({
        total_amount: '',
        installments_count: '1',
        payment_method: 'PIX',
        student_id: '',
        class_id: '',
        first_due_date: new Date().toISOString().split('T')[0],
      })
      setPreview([])
    }
  }, [isOpen])

  useEffect(() => {
    const total = Number(formData.total_amount)
    const count = Number(formData.installments_count)
    if (total > 0 && count > 0 && formData.first_due_date) {
      const baseAmount = Math.floor((total / count) * 100) / 100
      const remainder = Math.round((total - baseAmount * count) * 100) / 100
      const [year, month, day] = formData.first_due_date.split('-').map(Number)

      const newPreview = []
      for (let i = 0; i < count; i++) {
        const nextMonthDate = new Date(year, month - 1 + i, 1)
        const lastDayOfMonth = new Date(year, month + i, 0).getDate()
        nextMonthDate.setDate(Math.min(day, lastDayOfMonth))

        const y = nextMonthDate.getFullYear()
        const m = String(nextMonthDate.getMonth() + 1).padStart(2, '0')
        const dd = String(nextMonthDate.getDate()).padStart(2, '0')

        newPreview.push({
          id: i,
          amount: i === count - 1 ? +(baseAmount + remainder).toFixed(2) : baseAmount,
          due_date: `${y}-${m}-${dd}`,
        })
      }
      setPreview(newPreview)
    } else {
      setPreview([])
    }
  }, [formData.total_amount, formData.installments_count, formData.first_due_date])

  const handleDateChange = (id: number, newDate: string) => {
    setPreview((prev) => prev.map((p) => (p.id === id ? { ...p, due_date: newDate } : p)))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (preview.length === 0) return

    setLoading(true)
    try {
      const payload = preview.map((p) => ({
        amount: Number(p.amount),
        type: 'income',
        status: 'Pendente',
        payment_method: formData.payment_method,
        due_date: p.due_date,
        student_id: formData.student_id || null,
        class_id: formData.class_id || null,
      }))

      const { error } = await supabase.from('transactions').insert(payload)
      if (error) throw error

      toast({ title: 'Sucesso', description: 'Parcelas geradas com sucesso.' })
      onSuccess()
      onClose()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerar Parcelamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            >
              <option value="">Selecione um aluno (Opcional)</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            >
              <option value="">Selecione uma turma (Opcional)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              step="0.01"
              placeholder="Valor Total (R$)"
              value={formData.total_amount}
              onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
              required
            />
            <Input
              type="number"
              min="1"
              max="48"
              placeholder="Nº de Parcelas"
              value={formData.installments_count}
              onChange={(e) => setFormData({ ...formData, installments_count: e.target.value })}
              required
            />
            <Input
              type="date"
              placeholder="Primeiro Vencimento"
              value={formData.first_due_date}
              onChange={(e) => setFormData({ ...formData, first_due_date: e.target.value })}
              required
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            >
              <option value="PIX">PIX</option>
              <option value="Cartão">Cartão</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          {preview.length > 0 && (
            <div className="mt-6 border rounded-lg p-4 bg-muted/20">
              <h4 className="font-medium text-sm mb-3">Pré-visualização das Parcelas</h4>
              <div className="overflow-y-auto max-h-[220px] space-y-2 pr-2">
                {preview.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-background p-2 rounded-md border shadow-sm"
                  >
                    <div className="w-12 text-center text-xs font-semibold text-muted-foreground bg-muted py-1 rounded">
                      {idx + 1}/{preview.length}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="date"
                        value={p.due_date}
                        onChange={(e) => handleDateChange(p.id, e.target.value)}
                        className="h-8"
                        required
                      />
                    </div>
                    <div className="w-28 text-right font-medium text-sm">
                      R$ {p.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || preview.length === 0}>
              Salvar Parcelas
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
