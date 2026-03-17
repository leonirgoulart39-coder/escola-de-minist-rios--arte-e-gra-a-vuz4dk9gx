import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const { signIn, signUp, session } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('admin@escola.com')
  const [password, setPassword] = useState('admin123')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      })
      return
    }

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: 'Erro de validação',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password, name)
      if (error) {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Conta criada!',
          description:
            'Sua conta foi criada com sucesso. Verifique seu email ou faça login se já estiver autenticado.',
        })
        setIsSignUp(false)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        let msg = error.message
        if (msg.includes('Invalid login credentials')) {
          msg = 'Email ou senha inválidos.'
        }
        toast({
          title: 'Erro no login',
          description: msg,
          variant: 'destructive',
        })
      } else {
        navigate('/', { replace: true })
      }
    }

    setLoading(false)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    if (!isSignUp) {
      setEmail('')
      setPassword('')
    } else {
      setEmail('admin@escola.com')
      setPassword('admin123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-sm animate-fade-in-up">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center mb-2 mt-4">
            <img
              src="/logo.png"
              alt="Logo da Escola"
              className="h-20 w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.src =
                  'https://img.usecurling.com/i?q=brand&shape=fill&color=solid-black'
              }}
            />
          </div>
          <CardDescription className="text-base font-medium">
            {isSignUp
              ? 'Crie sua conta para acessar o sistema.'
              : 'Faça login para acessar o painel de gestão.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@escola.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSignUp ? 'Cadastrar' : 'Entrar'}
            </Button>

            <div className="text-center mt-4">
              <Button
                variant="link"
                type="button"
                className="text-sm text-muted-foreground hover:text-primary p-0 h-auto font-normal"
                onClick={toggleMode}
              >
                {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
