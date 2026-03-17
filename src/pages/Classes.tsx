import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Users, BookOpen, MoreHorizontal, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ClassFormModal } from '@/components/classes/ClassFormModal'

export default function Classes() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchClasses = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('classes')
      .select('*, enrollments(count)')
      .order('created_at', { ascending: true })
    if (data) {
      setCourses(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          instructor: c.teacher_name,
          students: c.enrollments?.[0]?.count || 0,
          color: c.color || 'bg-primary/10 text-primary',
          time: c.schedule,
          room: c.description || 'Sala Padrão',
          raw: c,
        })),
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta turma?')) return
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Turma excluída.' })
      fetchClasses()
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Turmas & Cursos
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie o catálogo de cursos e o calendário de aulas.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(null)
            setIsFormOpen(true)
          }}
          className="w-full sm:w-auto shadow-sm"
        >
          <BookOpen className="mr-2 h-4 w-4" /> Novo Curso
        </Button>
      </div>

      <Tabs defaultValue="cursos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger
            value="cursos"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Cursos Ativos
          </TabsTrigger>
          <TabsTrigger
            value="agenda"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Agenda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-md transition-shadow group relative"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-background/50 z-10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCourse(course.raw)
                          setIsFormOpen(true)
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 focus:bg-red-100 focus:text-red-600"
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className={`h-2 w-full transition-colors ${course.color.split(' ')[0]}`} />
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-xl font-bold pr-6">{course.name}</CardTitle>
                    <CardDescription className="font-medium text-sm">
                      {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {course.students} alunos
                      </div>
                      <Badge variant="secondary" className="bg-muted shadow-none">
                        Ativo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {courses.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  Nenhum curso encontrado.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="agenda" className="mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1 h-fit">
              <CardContent className="p-5 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg border border-border/50 bg-background/50 shadow-sm p-3 w-full max-w-[300px]"
                  classNames={{
                    day_selected: 'bg-primary text-primary-foreground',
                    day_today: 'bg-accent text-accent-foreground',
                  }}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-border/50 bg-muted/10 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Aulas de {date?.toLocaleDateString('pt-BR') || 'Hoje'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma aula agendada.
                    </div>
                  ) : (
                    courses.map((aula, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div className="bg-primary/10 text-primary p-3 rounded-xl font-bold w-24 text-center tracking-tight shadow-sm border border-primary/10">
                            {aula.time}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-foreground">{aula.name}</h4>
                            <p className="text-sm font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                              {aula.room}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center gap-2 pl-24 sm:pl-0">
                          <Badge
                            variant="outline"
                            className="bg-background shadow-sm px-3 py-1 text-sm font-medium"
                          >
                            {aula.students} presenças
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ClassFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        course={editingCourse}
        onSuccess={fetchClasses}
      />
    </div>
  )
}
