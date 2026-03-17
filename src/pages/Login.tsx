import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import logoImg from '@/assets/logo-ibms-02077.jpg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    const { error } = await signIn(email, password)
    setIsLoading(false)

    if (error) {
      toast({
        title: 'Erro de autenticação',
        description: 'E-mail ou senha incorretos.',
        variant: 'destructive',
      })
    } else {
      navigate('/')
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <img
            src={logoImg}
            alt="Arte e Graça"
            className="h-8 w-8 rounded-md object-cover bg-white"
          />
          Arte e Graça
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "A arte transforma vidas e a graça nos conduz a um futuro mais brilhante."
            </p>
            <footer className="text-sm text-zinc-400">Escola de Artes</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 p-4 flex h-full items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center items-center">
            <img
              src={logoImg}
              alt="Arte e Graça"
              className="h-16 w-16 rounded-xl object-cover lg:hidden mb-4 border shadow-sm"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Insira seu e-mail e senha para entrar na plataforma
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    placeholder="nome@exemplo.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button disabled={isLoading} type="submit" className="w-full mt-2">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </div>
            </form>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Esqueceu sua senha?{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Recuperar acesso
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
