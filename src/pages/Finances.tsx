import { useEffect, useState } from 'react'
import {
  Plus,
  Download,
  DollarSign,
  Clock,
  XCircle,
  MoreHorizontal,
  Loader2,
  Copy,
} from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { TransactionFormModal } from '@/components/finances/TransactionFormModal'
import { InstallmentFormModal } from '@/components/finances/InstallmentFormModal'
import { ClassCashFlowTable } from '@/components/finances/ClassCashFlowTable'

export default function Finances() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<any[]>([])
  const [cashFlow, setCashFlow] = useState<any[]>([])
  const [pieData, setPieData] = useState<any[]>([])
  const [kpis, setKpis] = useState({ paid: 0, pending: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isInstallmentFormOpen, setIsInstallmentFormOpen] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const fetchFinances = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('transactions')
      .select('*, students(name), classes(name)')
      .order('due_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (data) {
      const parsedInvoices = data.map((t: any) => ({
        rawId: t.id,
        id: t.id.substring(0, 8),
        student: t.students?.name || 'Desconhecido',
        className: t.classes?.name || 'Outros',
        amount: Number(t.amount),
        status: t.status,
        paymentMethod: t.payment_method || 'N/A',
        date: new Date(t.due_date || t.created_at).toLocaleDateString('pt-BR'),
        type: t.type,
      }))
      setInvoices(parsedInvoices)

      const totals = { paid: 0, pending: 0, cancelled: 0 }
      const classFlowMap: Record<string, any> = {}
      const courseIncomeMap: Record<string, number> = {}

      parsedInvoices.forEach((inv: any) => {
        if (inv.type === 'income') {
          if (inv.status === 'Pago') totals.paid += inv.amount
          if (inv.status === 'Pendente') totals.pending += inv.amount
          if (inv.status === 'Cancelado') totals.cancelled += inv.amount

          const cName = inv.className
          if (!classFlowMap[cName])
            classFlowMap[cName] = { class: cName, paid: 0, pending: 0, cancelled: 0 }

          if (inv.status === 'Pago') {
            classFlowMap[cName].paid += inv.amount
            courseIncomeMap[cName] = (courseIncomeMap[cName] || 0) + inv.amount
          }
          if (inv.status === 'Pendente') classFlowMap[cName].pending += inv.amount
          if (inv.status === 'Cancelado') classFlowMap[cName].cancelled += inv.amount
        }
      })

      setKpis(totals)
      setCashFlow(Object.values(classFlowMap))

      const colors = [
        'var(--color-course1)',
        'var(--color-course2)',
        'var(--color-course3)',
        'var(--color-course4)',
      ]
      setPieData(
        Object.entries(courseIncomeMap).map(([course, value], idx) => ({
          course,
          value,
          fill: colors[idx % colors.length],
        })),
      )
    }
    setRefreshCounter((c) => c + 1)
    setLoading(false)
  }

  useEffect(() => {
    fetchFinances()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const payload: any = { status }
    if (status === 'Pago') {
      payload.payment_date = new Date().toISOString().split('T')[0]
    } else {
      payload.payment_date = null
    }

    const { error } = await supabase.from('transactions').update(payload).eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: `Status alterado para ${status}.` })
      fetchFinances()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta transação?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Transação excluída.' })
      fetchFinances()
    }
  }

  const KPI_DATA = [
    {
      title: 'Pagas',
      value: kpis.paid,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Pendentes',
      value: kpis.pending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'Canceladas',
      value: kpis.cancelled,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1 sm:flex-none shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Novo Registro
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsFormOpen(true)}>
                <DollarSign className="mr-2 h-4 w-4" /> Transação Única
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsInstallmentFormOpen(true)}>
                <Copy className="mr-2 h-4 w-4" /> Gerar Parcelamento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {KPI_DATA.map((kpi, i) => (
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
            {pieData.length === 0 && !loading ? (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                Sem dados suficientes.
              </div>
            ) : (
              <ChartContainer
                config={{
                  course1: { label: 'Curso 1', color: 'hsl(var(--chart-1))' },
                  course2: { label: 'Curso 2', color: 'hsl(var(--chart-2))' },
                  course3: { label: 'Curso 3', color: 'hsl(var(--chart-3))' },
                  course4: { label: 'Curso 4', color: 'hsl(var(--chart-4))' },
                }}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      nameKey="course"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} className="flex-wrap text-sm" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border/50 bg-muted/10 rounded-t-xl pb-5">
            <CardTitle>Últimas Transações e Parcelas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Aluno</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma transação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/30">
                        <TableCell className="font-semibold pl-6">{invoice.student}</TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                            {invoice.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell
                          className={cn(
                            'font-medium',
                            invoice.type === 'expense' && 'text-red-600',
                          )}
                        >
                          {invoice.type === 'expense' ? '-' : '+'} R$ {invoice.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateStatus(invoice.rawId, 'Pago')}>
                                Marcar como Pago
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateStatus(invoice.rawId, 'Pendente')}
                              >
                                Marcar como Pendente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateStatus(invoice.rawId, 'Cancelado')}
                              >
                                Cancelar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(invoice.rawId)}
                                className="text-red-600 focus:bg-red-100 focus:text-red-600"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ClassCashFlowTable refreshTrigger={refreshCounter} />

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa por Turma</CardTitle>
          <CardDescription>
            Valores totais de parcelas pagas, pendentes e canceladas por curso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cashFlow.length === 0 && !loading ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Sem dados suficientes.
            </div>
          ) : (
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
                  data={cashFlow}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="4 4"
                  />
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
          )}
        </CardContent>
      </Card>

      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchFinances}
      />
      <InstallmentFormModal
        isOpen={isInstallmentFormOpen}
        onClose={() => setIsInstallmentFormOpen(false)}
        onSuccess={fetchFinances}
      />
    </div>
  )
}
