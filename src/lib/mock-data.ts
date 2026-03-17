export const MOCK_STUDENTS = [
  {
    id: '1',
    name: 'Ana Clara',
    course: 'Pintura a Óleo',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  {
    id: '2',
    name: 'João Silva',
    course: 'Arte Digital',
    status: 'Inativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
  },
  {
    id: '3',
    name: 'Marina Costa',
    course: 'Escultura',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
  },
  {
    id: '4',
    name: 'Pedro Alves',
    course: 'Aquarela',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
  },
  {
    id: '5',
    name: 'Beatriz Lima',
    course: 'Desenho Realista',
    status: 'Ativo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5',
  },
]

export const MOCK_COURSES = [
  {
    id: '1',
    name: 'Pintura a Óleo',
    instructor: 'Prof. Roberto',
    students: 12,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: '2',
    name: 'Arte Digital',
    instructor: 'Profa. Julia',
    students: 25,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: '3',
    name: 'Escultura',
    instructor: 'Prof. Marcos',
    students: 8,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: '4',
    name: 'Aquarela',
    instructor: 'Profa. Sofia',
    students: 15,
    color: 'bg-emerald-100 text-emerald-700',
  },
]

export const MOCK_CLASSES_TODAY = [
  { time: '09:00', course: 'Aquarela', room: 'Sala 3', occupancy: '12/15' },
  { time: '10:30', course: 'Arte Digital', room: 'Lab 1', occupancy: '20/25' },
  { time: '14:00', course: 'Escultura', room: 'Ateliê A', occupancy: '8/8' },
  { time: '16:00', course: 'Pintura a Óleo', room: 'Sala 2', occupancy: '10/12' },
]

export const MOCK_FINANCES_CHART = [
  { month: 'Jan', receitas: 12500, despesas: 8000 },
  { month: 'Fev', receitas: 14200, despesas: 8200 },
  { month: 'Mar', receitas: 13800, despesas: 8500 },
  { month: 'Abr', receitas: 15100, despesas: 9000 },
  { month: 'Mai', receitas: 16500, despesas: 8800 },
  { month: 'Jun', receitas: 17200, despesas: 9200 },
]

export const MOCK_FINANCES_PIE = [
  { course: 'Pintura a Óleo', value: 4500, fill: 'var(--color-course1)' },
  { course: 'Arte Digital', value: 6200, fill: 'var(--color-course2)' },
  { course: 'Escultura', value: 2100, fill: 'var(--color-course3)' },
  { course: 'Aquarela', value: 3800, fill: 'var(--color-course4)' },
]

export const MOCK_INVOICES = [
  { id: 'INV-001', student: 'Ana Clara', amount: 350, status: 'Pago', date: '01/10/2023' },
  { id: 'INV-002', student: 'João Silva', amount: 450, status: 'Atrasado', date: '28/09/2023' },
  { id: 'INV-003', student: 'Marina Costa', amount: 300, status: 'Pendente', date: '05/10/2023' },
  { id: 'INV-004', student: 'Pedro Alves', amount: 300, status: 'Pago', date: '02/10/2023' },
  { id: 'INV-005', student: 'Beatriz Lima', amount: 400, status: 'Pago', date: '01/10/2023' },
]

export const MOCK_GALLERY = [
  {
    id: '1',
    title: 'Retrato ao Pôr do Sol',
    artist: 'Ana Clara',
    technique: 'Óleo',
    img: 'https://img.usecurling.com/p/600/800?q=oil%20painting%20portrait',
  },
  {
    id: '2',
    title: 'Cidade Futurista',
    artist: 'João Silva',
    technique: 'Arte Digital',
    img: 'https://img.usecurling.com/p/800/600?q=cyberpunk%20city%20art',
  },
  {
    id: '3',
    title: 'Busto Clássico',
    artist: 'Marina Costa',
    technique: 'Escultura',
    img: 'https://img.usecurling.com/p/600/600?q=marble%20sculpture',
  },
  {
    id: '4',
    title: 'Jardim Botânico',
    artist: 'Pedro Alves',
    technique: 'Aquarela',
    img: 'https://img.usecurling.com/p/600/900?q=watercolor%20garden',
  },
  {
    id: '5',
    title: 'Olhar Profundo',
    artist: 'Beatriz Lima',
    technique: 'Grafite',
    img: 'https://img.usecurling.com/p/700/700?q=pencil%20sketch%20eye',
  },
  {
    id: '6',
    title: 'Abstrato Azul',
    artist: 'Ana Clara',
    technique: 'Acrílica',
    img: 'https://img.usecurling.com/p/800/800?q=blue%20abstract%20painting',
  },
]
