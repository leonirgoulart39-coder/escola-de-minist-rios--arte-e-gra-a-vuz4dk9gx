import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function StudentFormModal({ isOpen, onClose, student, onSuccess }: any) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Ativo',
    avatar_url: '',
    class_id: '',
  })

  useEffect(() => {
    supabase
      .from('classes')
      .select('id, name')
      .then(({ data }) => setClasses(data || []))
  }, [])

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email || '',
        phone: student.phone || '',
        status: student.status || 'Ativo',
        avatar_url: student.avatar_url || '',
        class_id: student.enrollments?.[0]?.classes?.id || '',
      })
    } else {
      setFormData({ name: '', email: '', phone: '', status: 'Ativo', avatar_url: '', class_id: '' })
    }
  }, [student, isOpen])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      let studentId = student?.id

      if (studentId) {
        const { error } = await supabase
          .from('students')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            avatar_url: formData.avatar_url,
          })
          .eq('id', studentId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('students')
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            avatar_url: formData.avatar_url,
          })
          .select()
          .single()
        if (error) throw error
        studentId = data.id
      }

      if (formData.class_id) {
        await supabase.from('enrollments').delete().eq('student_id', studentId)
        await supabase
          .from('enrollments')
          .insert({ student_id: studentId, class_id: formData.class_id })
      } else {
        await supabase.from('enrollments').delete().eq('student_id', studentId)
      }

      toast({ title: 'Sucesso', description: 'Aluno salvo com sucesso.' })
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
          <DialogTitle>{student ? 'Editar' : 'Novo'} Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome Completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            placeholder="URL da Foto de Perfil"
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
          >
            <option value="">Selecione um curso (Opcional)...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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
