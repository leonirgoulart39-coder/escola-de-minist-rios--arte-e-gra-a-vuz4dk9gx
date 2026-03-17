import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, Search, LayoutDashboard, Users, Palette, Wallet, Menu } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { title: 'Painel Geral', url: '/', icon: LayoutDashboard },
  { title: 'Alunos', url: '/alunos', icon: Users },
  { title: 'Turmas & Cursos', url: '/turmas', icon: Palette },
  { title: 'Financeiro', url: '/financeiro', icon: Wallet },
]

function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-3 px-1">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Palette className="size-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">
            Sintonia Arte
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="py-2.5 font-medium transition-all"
                >
                  <Link to={item.url}>
                    <item.icon className="size-4.5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

function TopHeader() {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-10 flex h-[4.5rem] shrink-0 items-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-8">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="relative w-full max-w-md ml-auto md:ml-0 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar alunos ou turmas..."
            className="w-full rounded-full bg-muted/50 border-transparent focus-visible:bg-background pl-10 md:w-[320px] transition-colors"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
            <span className="sr-only">Notificações</span>
          </Button>
          <div className="h-8 w-px bg-border/50 hidden sm:block"></div>
          <Avatar className="h-9 w-9 border border-border/50 ring-2 ring-transparent transition-all hover:ring-primary/20 cursor-pointer">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=10"
              alt="@admin"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 bg-muted/20">
        <TopHeader />
        <main className="flex-1 overflow-auto p-4 md:p-8 animate-fade-in">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
