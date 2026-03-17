import { Plus, Download } from 'lucide-react'
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
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useToast } from '@/hooks/use-toast'
import { MOCK_FINANCES_PIE, MOCK_INVOICES } from '@/lib/mock-data'

export default function Finances() {
  const { toast } = useToast()

  const handleCreateInvoice = () => {
    toast({
      title: 'Fatura Gerada',
      description: 'A fatura foi criada com sucesso e enviada ao aluno.',
    })
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground mt-1">Acompanhe mensalidades e receitas por curso.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Relatório
          </Button>
          <Button onClick={handleCreateInvoice} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Receita por Curso</CardTitle>
            <CardDescription>Distribuição atual de mensalidades</CardDescription>
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
            <CardDescription>Mensalidades recentes emitidas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_INVOICES.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {invoice.id}
                    </TableCell>
                    <TableCell className="font-medium">{invoice.student}</TableCell>
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
                        className={
                          invoice.status === 'Pago'
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : invoice.status === 'Pendente'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : ''
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
