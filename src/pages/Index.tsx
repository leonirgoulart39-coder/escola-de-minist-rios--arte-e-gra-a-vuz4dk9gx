import { Users, GraduationCap, DollarSign, UserPlus, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Legend } from 'recharts'
import { MOCK_FINANCES_CHART, MOCK_CLASSES_TODAY } from '@/lib/mock-data'

const STATS = [
  {
    title: 'Total de Alunos',
    value: '142',
    icon: Users,
    trend: '+4% este mês',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Aulas Hoje',
    value: '8',
    icon: GraduationCap,
    trend: '2 a iniciar',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 17.200',
    icon: DollarSign,
    trend: '+12% vs mês anterior',
    color: 'text-teal-600',
    bg: 'bg-teal-100',
  },
  {
    title: 'Novas Matrículas',
    value: '12',
    icon: UserPlus,
    trend: '+2 esta semana',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

export default function Index() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Visão Geral
        </h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo ao Sintonia Arte. Aqui está o resumo de hoje.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Card
            key={i}
            className="animate-slide-up hover:border-border/80 transition-colors"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.trend}</p>
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
                    dy={10}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    dataKey="receitas"
                    fill="var(--color-receitas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="despesas"
                    fill="var(--color-despesas)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card
          className="lg:col-span-3 animate-slide-up flex flex-col"
          style={{ animationDelay: '500ms' }}
        >
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
            <CardDescription>Aulas programadas para hoje</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {MOCK_CLASSES_TODAY.map((aula, i) => (
                <div key={i} className="flex items-center group">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-base font-semibold leading-none text-foreground">
                      {aula.course}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {aula.time} • {aula.room}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                    {aula.occupancy} alunos
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
