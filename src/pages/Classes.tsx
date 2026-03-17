import { Calendar as CalendarIcon, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MOCK_COURSES, MOCK_CLASSES_TODAY } from '@/lib/mock-data'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function Classes() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Turmas & Cursos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie o catálogo de cursos e o calendário de aulas.
        </p>
      </div>

      <Tabs defaultValue="cursos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cursos">Cursos Ativos</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {MOCK_COURSES.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 ${course.color.split(' ')[0]}`} />
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>{course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {course.students} alunos
                    </div>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agenda" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1 h-fit">
              <CardContent className="p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Aulas de {date?.toLocaleDateString('pt-BR') || 'Hoje'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_CLASSES_TODAY.map((aula, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-md font-bold w-20 text-center">
                        {aula.time}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{aula.course}</h4>
                        <p className="text-sm text-muted-foreground">{aula.room}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-2">
                      <Badge variant="secondary">{aula.occupancy} presenças</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
