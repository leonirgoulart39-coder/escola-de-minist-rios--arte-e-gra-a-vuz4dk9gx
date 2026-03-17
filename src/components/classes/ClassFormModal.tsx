import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function ClassFormModal({ isOpen, onClose, course, onSuccess }: any) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    teacher_name: '',
    description: '',
    schedule: '',
    color: 'bg-primary/10 text-primary',
  })

  useEffect(() => {
    if (course) setFormData({ ...course })
    else
      setFormData({
        name: '',
        teacher_name: '',
        description: '',
        schedule: '',
        color: 'bg-primary/10 text-primary',
      })
  }, [course, isOpen])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        teacher_name: formData.teacher_name,
        description: formData.description,
        schedule: formData.schedule,
        color: formData.color,
      }

      if (course?.id) {
        const { error } = await supabase.from('classes').update(payload).eq('id', course.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('classes').insert(payload)
        if (error) throw error
      }
      toast({ title: 'Sucesso', description: 'Turma salva com sucesso.' })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? 'Editar' : 'Nova'} Turma</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome do Curso"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Professor"
            value={formData.teacher_name}
            onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
          />
          <Input
            placeholder="Descrição ou Sala"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Horário (ex: 09:00)"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          >
            <option value="bg-primary/10 text-primary">Azul (Primária)</option>
            <option value="bg-emerald-100 text-emerald-800">Verde</option>
            <option value="bg-teal-100 text-teal-800">Turquesa</option>
            <option value="bg-secondary text-secondary-foreground">Cinza</option>
            <option value="bg-amber-100 text-amber-800">Amarelo</option>
            <option value="bg-rose-100 text-rose-800">Vermelho</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
