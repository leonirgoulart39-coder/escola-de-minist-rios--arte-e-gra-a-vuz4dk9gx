import { Users, GraduationCap, DollarSign, UserPlus, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Legend } from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MOCK_FINANCES_CHART, MOCK_CLASSES_TODAY } from '@/lib/mock-data'

const STATS = [
  {
    title: 'Total de Alunos',
    value: '142',
    icon: Users,
    trend: '+4% este mês',
    color: 'text-blue-600',
  },
  {
    title: 'Aulas Hoje',
    value: '8',
    icon: GraduationCap,
    trend: '2 a iniciar',
    color: 'text-purple-600',
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 17.200',
    icon: DollarSign,
    trend: '+12% vs mês anterior',
    color: 'text-emerald-600',
  },
  {
    title: 'Novas Matrículas',
    value: '12',
    icon: UserPlus,
    trend: '+2 esta semana',
    color: 'text-amber-600',
  },
]

export default function Index() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao ArtesFlow. Aqui está o resumo de hoje.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Desempenho Financeiro</CardTitle>
            <CardDescription>Receitas vs Despesas dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
                despesas: { label: 'Despesas', color: 'hsl(var(--accent))' },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_FINANCES_CHART}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="receitas" fill="var(--color-receitas)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesas" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
            <CardDescription>Aulas programadas para hoje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {MOCK_CLASSES_TODAY.map((aula, i) => (
              <div key={i} className="flex items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{aula.course}</p>
                  <p className="text-xs text-muted-foreground">
                    {aula.time} • {aula.room}
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  {aula.occupancy} alunos
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
