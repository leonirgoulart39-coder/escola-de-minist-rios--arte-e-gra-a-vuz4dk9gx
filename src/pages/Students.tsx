import { useState } from 'react'
import { Plus, MoreHorizontal, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie matrículas, status e perfis dos alunos.
          </p>
        </div>
        <Button onClick={handleAddStudent} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      <Card className="animate-slide-up">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STUDENTS.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        student.status === 'Ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild onClick={() => setSelectedStudent(student)}>
                            <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {selectedStudent && (
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Perfil do Aluno</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center gap-4 py-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={selectedStudent.avatar} />
                              <AvatarFallback>
                                {selectedStudent.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <h3 className="font-serif text-2xl font-bold">
                                {selectedStudent.name}
                              </h3>
                              <p className="text-muted-foreground">{selectedStudent.course}</p>
                            </div>
                            <div className="w-full space-y-3 mt-4">
                              <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {selectedStudent.name.toLowerCase().replace(' ', '.')}@email.com
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>(11) 98765-4321</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Matriculado desde Jan/2023</span>
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
