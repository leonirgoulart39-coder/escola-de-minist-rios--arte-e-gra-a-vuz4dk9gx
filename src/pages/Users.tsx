import { useEffect, useState } from 'react'
import { Search, UserCog } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  role?: string
}

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && !error) {
        setUsers(data as Profile[])
      }
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase()
    return (
      (user.full_name && user.full_name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            Gestão de Acessos
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie os usuários administrativos com acesso ao sistema.
          </p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10 rounded-t-xl">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-9 bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Nome Completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-right pr-6">Data de Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-semibold text-foreground">
                      {user.full_name || 'Usuário Sem Nome'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email || 'Email não disponível'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-medium text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
