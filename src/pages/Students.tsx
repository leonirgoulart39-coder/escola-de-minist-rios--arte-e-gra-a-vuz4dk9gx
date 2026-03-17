import { useState } from 'react'
import { Plus, MoreHorizontal, User, Mail, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { MOCK_STUDENTS } from '@/lib/mock-data'

export default function Students() {
  const { toast } = useToast()
  const [selectedStudent, setSelectedStudent] = useState<(typeof MOCK_STUDENTS)[0] | null>(null)

  const handleAddStudent = () => {
    toast({
      title: 'Função indisponível',
      description: 'A criação de alunos será implementada em breve.',
    })
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Alunos</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie matrículas, status e perfis dos alunos.
          </p>
        </div>
        <Button onClick={handleAddStudent} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10 rounded-t-xl">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar aluno..." className="pl-9 bg-background border-border/50" />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] pl-6">Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STUDENTS.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {student.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground">{student.course}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        student.status === 'Ativo'
                          ? 'bg-primary/15 text-primary hover:bg-primary/25 border-transparent shadow-none'
                          : 'shadow-none'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DialogTrigger asChild onClick={() => setSelectedStudent(student)}>
                            <DropdownMenuItem className="cursor-pointer">
                              Ver Perfil
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {selectedStudent && (
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Perfil do Aluno</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center gap-5 py-6">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-lg ring-1 ring-border/20">
                              <AvatarImage src={selectedStudent.avatar} />
                              <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
                                {selectedStudent.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center space-y-1">
                              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                {selectedStudent.name}
                              </h3>
                              <p className="text-muted-foreground font-medium">
                                {selectedStudent.course}
                              </p>
                            </div>
                            <div className="w-full space-y-4 mt-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                              <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-md shadow-sm border border-border/40">
                                  <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">
                                  {selectedStudent.name.toLowerCase().replace(' ', '.')}@email.com
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-md shadow-sm border border-border/40">
                                  <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">(11) 98765-4321</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-background rounded-md shadow-sm border border-border/40">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">
                                  Matriculado desde Jan/2023
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
