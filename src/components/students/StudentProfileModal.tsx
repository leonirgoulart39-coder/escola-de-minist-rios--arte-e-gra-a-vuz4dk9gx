import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Phone } from 'lucide-react'

export function StudentProfileModal({ student, onClose }: any) {
  if (!student) return null
  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Perfil do Aluno</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-6">
          <Avatar className="h-28 w-28 border-4 border-background shadow-lg ring-1 ring-border/20">
            <AvatarImage src={student.avatar_url} />
            <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
              {student.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{student.name}</h3>
            <p className="text-muted-foreground font-medium">{student.course}</p>
          </div>
          <div className="w-full space-y-4 mt-4 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-background rounded-md shadow-sm border border-border/40">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">{student.email || 'Sem email'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-background rounded-md shadow-sm border border-border/40">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">{student.phone || 'Sem telefone'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
