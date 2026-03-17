import { useEffect, useState } from 'react'
import { Users, GraduationCap, DollarSign, UserPlus, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '@/lib/supabase/client'

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      title: 'Total de Alunos',
      value: '0',
      icon: Users,
      trend: '',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Aulas Hoje',
      value: '0',
      icon: GraduationCap,
      trend: '',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Receita',
      value: 'R$ 0',
      icon: DollarSign,
      trend: '',
      color: 'text-teal-600',
      bg: 'bg-teal-100',
    },
    {
      title: 'Matrículas',
      value: '0',
      icon: UserPlus,
      trend: '',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ])
  const [financesChart, setFinancesChart] = useState<any[]>([])
  const [classesToday, setClassesToday] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [
        { count: studentCount },
        { data: classesData },
        { data: transactionsData },
        { count: enrollmentsCount },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'Ativo'),
        supabase.from('classes').select('*, enrollments(count)'),
        supabase.from('transactions').select('*'),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
      ])

      const totalRevenue = (transactionsData || [])
        .filter((t: any) => t.type === 'income' && t.status === 'Pago')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

      setStats([
        {
          title: 'Total de Alunos',
          value: String(studentCount || 0),
          icon: Users,
          trend: 'Ativos',
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
        {
          title: 'Aulas Ativas',
          value: String(classesData?.length || 0),
          icon: GraduationCap,
          trend: 'Neste semestre',
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
        },
        {
          title: 'Receita Total',
          value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
          icon: DollarSign,
          trend: 'Acumulado',
          color: 'text-teal-600',
          bg: 'bg-teal-100',
        },
        {
          title: 'Total Matrículas',
          value: String(enrollmentsCount || 0),
          icon: UserPlus,
          trend: 'Realizadas',
          color: 'text-primary',
          bg: 'bg-primary/10',
        },
      ])

      const todayClassesList = (classesData || []).map((c: any) => ({
        time: c.schedule,
        course: c.name,
        room: c.description || 'Sala Principal',
        occupancy: c.enrollments[0]?.count || 0,
      }))
      setClassesToday(todayClassesList)

      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
      const chartData = months.map((month) => ({ month, receitas: 0, despesas: 0 }))

      ;(transactionsData || []).forEach((t: any) => {
        const date = new Date(t.created_at)
        const monthIdx = date.getMonth() % 6
        if (t.type === 'income' && t.status === 'Pago') {
          chartData[monthIdx].receitas += Number(t.amount)
        } else if (t.type === 'expense') {
          chartData[monthIdx].despesas += Number(t.amount)
        }
      })

      if (chartData.every((d) => d.receitas === 0 && d.despesas === 0)) {
        chartData[0].receitas = totalRevenue
      }

      setFinancesChart(chartData)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Visão Geral
        </h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo ao sistema. Aqui está o resumo de hoje.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.trend}</p>
                </>
              )}
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
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
                  despesas: { label: 'Despesas', color: 'hsl(var(--accent))' },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={financesChart}
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
            )}
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
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : classesToday.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma aula encontrada.
                </div>
              ) : (
                classesToday.map((aula, i) => (
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
