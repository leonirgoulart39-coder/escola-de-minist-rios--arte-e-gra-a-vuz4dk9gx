import { Plus, Download, DollarSign, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { useToast } from '@/hooks/use-toast'
import { MOCK_FINANCES_PIE, MOCK_INVOICES, MOCK_CASH_FLOW_BY_CLASS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function Finances() {
  const { toast } = useToast()

  const totalPaid = MOCK_CASH_FLOW_BY_CLASS.reduce((acc, curr) => acc + curr.paid, 0)
  const totalPending = MOCK_CASH_FLOW_BY_CLASS.reduce((acc, curr) => acc + curr.pending, 0)
  const totalCancelled = MOCK_CASH_FLOW_BY_CLASS.reduce((acc, curr) => acc + curr.cancelled, 0)

  const KPIS = [
    {
      title: 'Pagas',
      value: totalPaid,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Pendentes',
      value: totalPending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'Canceladas',
      value: totalCancelled,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ]

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Financeiro
          </h1>
          <p className="text-muted-foreground text-lg mt-1">Visão geral do caixa e faturas.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none shadow-sm bg-background">
            <Download className="mr-2 h-4 w-4" /> Relatório
          </Button>
          <Button
            onClick={() =>
              toast({ title: 'Fatura Gerada', description: 'Enviada ao aluno com sucesso.' })
            }
            className="flex-1 sm:flex-none shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {KPIS.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {kpi.title}
              </CardTitle>
              <div className={cn('p-2 rounded-lg', kpi.bg)}>
                <kpi.icon className={cn('h-5 w-5', kpi.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                R$ {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Receita por Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                course1: { label: 'Pintura a Óleo', color: 'hsl(var(--chart-1))' },
                course2: { label: 'Arte Digital', color: 'hsl(var(--chart-2))' },
                course3: { label: 'Escultura', color: 'hsl(var(--chart-3))' },
                course4: { label: 'Aquarela', color: 'hsl(var(--chart-4))' },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_FINANCES_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {MOCK_FINANCES_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} className="flex-wrap text-sm" />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border/50 bg-muted/10 rounded-t-xl pb-5">
            <CardTitle>Últimas Faturas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Aluno</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_INVOICES.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold pl-6">{invoice.student}</TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                          {invoice.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell className="font-medium">R$ {invoice.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            'shadow-none font-medium border-transparent',
                            invoice.status === 'Pago' && 'bg-primary/15 text-primary',
                            invoice.status === 'Pendente' && 'bg-amber-100 text-amber-700',
                            invoice.status === 'Cancelado' && 'bg-rose-100 text-rose-700',
                          )}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa por Turma</CardTitle>
          <CardDescription>
            Valores mensais de parcelas pagas, pendentes e canceladas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              paid: { label: 'Pagas', color: 'hsl(var(--primary))' },
              pending: { label: 'Pendentes', color: '#f59e0b' },
              cancelled: { label: 'Canceladas', color: '#f43f5e' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_CASH_FLOW_BY_CLASS}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <XAxis
                  dataKey="class"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R$${v}`}
                  width={60}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} iconType="circle" />
                <Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
