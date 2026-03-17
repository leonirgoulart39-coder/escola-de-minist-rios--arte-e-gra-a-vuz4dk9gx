import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  GraduationCap,
  CalendarDays,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo-ibms-02077.jpg'

export function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Alunos', href: '/students', icon: GraduationCap },
    { name: 'Professores', href: '/teachers', icon: Users },
    { name: 'Aulas', href: '/classes', icon: CalendarDays },
  ]

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AG'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <MobileLink
                href="/"
                className="flex items-center gap-2 mb-8"
                onOpenChange={setIsMobileMenuOpen}
              >
                <img src={logoImg} alt="Arte e Graça" className="h-8 w-8 rounded-md object-cover" />
                <span className="font-bold">Arte e Graça</span>
              </MobileLink>
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setIsMobileMenuOpen}
                    className={cn(
                      'flex items-center gap-2 text-muted-foreground',
                      location.pathname === item.href && 'text-foreground font-medium',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </MobileLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Nav */}
          <div className="mr-4 hidden md:flex w-full justify-between">
            <div className="flex items-center gap-6 md:gap-8">
              <Link to="/" className="flex items-center gap-2 mr-4">
                <img src={logoImg} alt="Arte e Graça" className="h-8 w-8 rounded-md object-cover" />
                <span className="hidden font-bold sm:inline-block">Arte e Graça</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'transition-colors hover:text-foreground/80',
                      location.pathname === item.href ? 'text-foreground' : 'text-foreground/60',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Minha Conta</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
}

function MobileLink({ href, onOpenChange, className, children }: MobileLinkProps) {
  const navigate = useNavigate()
  return (
    <Link
      to={href}
      onClick={() => {
        navigate(href)
        onOpenChange?.(false)
      }}
      className={cn(className)}
    >
      {children}
    </Link>
  )
}
