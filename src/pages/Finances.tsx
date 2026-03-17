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
    { title: 'Pagas', value: totalPaid, icon: DollarSign, color: 'text-emerald-500' },
    { title: 'Pendentes', value: totalPending, icon: Clock, color: 'text-amber-500' },
    { title: 'Canceladas', value: totalCancelled, icon: XCircle, color: 'text-rose-500' },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Visão geral do caixa e faturas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Relatório
          </Button>
          <Button
            onClick={() =>
              toast({ title: 'Fatura Gerada', description: 'Enviada ao aluno com sucesso.' })
            }
            className="flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {KPIS.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={cn('h-4 w-4', kpi.color)} />
            </CardHeader>
            <CardContent>
              <div className={cn('text-2xl font-bold', kpi.color)}>
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
                course1: { label: 'Pintura', color: 'hsl(var(--chart-1))' },
                course2: { label: 'Digital', color: 'hsl(var(--chart-2))' },
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
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {MOCK_FINANCES_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimas Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_INVOICES.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.student}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {invoice.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            invoice.status === 'Pago'
                              ? 'default'
                              : invoice.status === 'Pendente'
                                ? 'secondary'
                                : 'destructive'
                          }
                          className={cn(
                            invoice.status === 'Pago' && 'bg-emerald-500 hover:bg-emerald-600',
                            invoice.status === 'Pendente' &&
                              'bg-amber-500 hover:bg-amber-600 text-white',
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
              paid: { label: 'Pagas', color: '#10b981' },
              pending: { label: 'Pendentes', color: '#f59e0b' },
              cancelled: { label: 'Canceladas', color: '#f43f5e' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_CASH_FLOW_BY_CLASS}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="class" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R$${v}`}
                  width={60}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <ChartLegend content={<ChartLegendContent />} />
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
