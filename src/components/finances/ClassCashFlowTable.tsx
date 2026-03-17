import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ClassCashFlowTableProps {
  refreshTrigger: number
}

interface ClassFlow {
  id: string
  name: string
  teacher_name: string
  months: number[]
  pending: number
  cancelled: number
}

export function ClassCashFlowTable({ refreshTrigger }: ClassCashFlowTableProps) {
  const [data, setData] = useState<ClassFlow[]>([])
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()
  const MONTHS = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [transRes, classesRes] = await Promise.all([
          supabase.from('transactions').select('*').eq('type', 'income'),
          supabase.from('classes').select('id, name, teacher_name').order('name'),
        ])

        const transactions = transRes.data || []
        const classes = classesRes.data || []

        const flowMap: Record<string, ClassFlow> = {}

        classes.forEach((c) => {
          flowMap[c.id] = {
            id: c.id,
            name: c.name,
            teacher_name: c.teacher_name || '-',
            months: Array(12).fill(0),
            pending: 0,
            cancelled: 0,
          }
        })

        transactions.forEach((t) => {
          if (!t.class_id || !flowMap[t.class_id]) return
          const cFlow = flowMap[t.class_id]

          if (t.status === 'Pago') {
            const dateStr = t.payment_date || t.due_date || t.created_at
            if (dateStr) {
              const justDate = dateStr.split('T')[0]
              const [y, m] = justDate.split('-')
              if (parseInt(y) === currentYear) {
                cFlow.months[parseInt(m) - 1] += Number(t.amount)
              }
            }
          } else if (t.status === 'Pendente') {
            cFlow.pending += Number(t.amount)
          } else if (t.status === 'Cancelado') {
            cFlow.cancelled += Number(t.amount)
          }
        })

        setData(Object.values(flowMap))
      } catch (error) {
        console.error('Error fetching class cash flow:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshTrigger, currentYear])

  const formatCurrency = (val: number) =>
    `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Card className="animate-slide-up">
      <CardHeader className="border-b border-border/50 bg-muted/10 rounded-t-xl pb-5">
        <CardTitle>Fluxo de Caixa por Turma ({currentYear})</CardTitle>
        <CardDescription>
          Valores pagos mensalmente e totais pendentes ou cancelados por turma.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[180px] pl-6 sticky left-0 bg-background z-20 shadow-[1px_0_0_0_hsl(var(--border)/0.5)]">
                  Turma
                </TableHead>
                <TableHead className="min-w-[150px]">Professor</TableHead>
                {MONTHS.map((m) => (
                  <TableHead key={m} className="text-right min-w-[110px]">
                    {m}
                  </TableHead>
                ))}
                <TableHead className="text-right min-w-[130px]">Pendentes</TableHead>
                <TableHead className="text-right min-w-[130px] pr-6">Cancelados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={16} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={16} className="h-32 text-center text-muted-foreground">
                    Nenhuma turma encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold pl-6 sticky left-0 bg-background z-10 shadow-[1px_0_0_0_hsl(var(--border)/0.5)]">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.teacher_name}</TableCell>
                    {row.months.map((val, idx) => (
                      <TableCell
                        key={idx}
                        className={cn(
                          'text-right font-medium',
                          val > 0 ? 'text-foreground' : 'text-muted-foreground/50',
                        )}
                      >
                        {formatCurrency(val)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right text-amber-600 font-semibold bg-amber-500/5">
                      {formatCurrency(row.pending)}
                    </TableCell>
                    <TableCell className="text-right text-rose-600 font-semibold bg-rose-500/5 pr-6">
                      {formatCurrency(row.cancelled)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
