-- Profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    teacher_name TEXT,
    schedule TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, class_id)
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    status TEXT NOT NULL CHECK (status IN ('Pago', 'Pendente', 'Cancelado')),
    payment_method TEXT CHECK (payment_method IN ('PIX', 'Cartão', 'Boleto')),
    category TEXT,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    due_date DATE,
    payment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to students" ON public.students FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to classes" ON public.classes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to enrollments" ON public.enrollments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated full access to transactions" ON public.transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert Seed Data
DO $$
DECLARE
    admin_id uuid := gen_random_uuid();
    s1_id uuid := gen_random_uuid();
    s2_id uuid := gen_random_uuid();
    s3_id uuid := gen_random_uuid();
    s4_id uuid := gen_random_uuid();
    c1_id uuid := gen_random_uuid();
    c2_id uuid := gen_random_uuid();
    c3_id uuid := gen_random_uuid();
    c4_id uuid := gen_random_uuid();
BEGIN
    -- Insert Admin Auth User
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
        admin_id, '00000000-0000-0000-0000-000000000000', 'admin@sintonia.arte',
        crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW(),
        '{"provider": "email", "providers": ["email"]}', '{"name": "Administrador"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, full_name, avatar_url) VALUES (admin_id, 'Admin S.', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=10');

    -- Insert Students
    INSERT INTO public.students (id, name, email, phone, status, avatar_url) VALUES
        (s1_id, 'Ana Clara', 'ana@email.com', '(11) 99999-1111', 'Ativo', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1'),
        (s2_id, 'João Silva', 'joao@email.com', '(11) 99999-2222', 'Inativo', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2'),
        (s3_id, 'Marina Costa', 'marina@email.com', '(11) 99999-3333', 'Ativo', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3'),
        (s4_id, 'Pedro Alves', 'pedro@email.com', '(11) 99999-4444', 'Ativo', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4');

    -- Insert Classes
    INSERT INTO public.classes (id, name, description, teacher_name, schedule, color) VALUES
        (c1_id, 'Pintura a Óleo', 'Técnicas clássicas', 'Prof. Roberto', '09:00', 'bg-primary/10 text-primary'),
        (c2_id, 'Arte Digital', 'Ilustração no tablet', 'Profa. Julia', '10:30', 'bg-emerald-100 text-emerald-800'),
        (c3_id, 'Escultura', 'Modelagem em argila', 'Prof. Marcos', '14:00', 'bg-teal-100 text-teal-800'),
        (c4_id, 'Aquarela', 'Técnicas com água', 'Profa. Sofia', '16:00', 'bg-secondary text-secondary-foreground');

    -- Insert Enrollments
    INSERT INTO public.enrollments (student_id, class_id) VALUES
        (s1_id, c1_id), (s1_id, c2_id), (s2_id, c2_id), (s3_id, c3_id), (s4_id, c4_id);

    -- Insert Transactions
    INSERT INTO public.transactions (amount, type, status, payment_method, category, student_id, class_id, due_date) VALUES
        (350.00, 'income', 'Pago', 'PIX', 'Mensalidade', s1_id, c1_id, CURRENT_DATE),
        (450.00, 'income', 'Cancelado', 'Boleto', 'Mensalidade', s2_id, c2_id, CURRENT_DATE - INTERVAL '5 days'),
        (300.00, 'income', 'Pendente', 'Cartão', 'Mensalidade', s3_id, c3_id, CURRENT_DATE + INTERVAL '2 days'),
        (350.00, 'income', 'Pago', 'PIX', 'Mensalidade', s1_id, c2_id, CURRENT_DATE - INTERVAL '1 month'),
        (400.00, 'income', 'Pago', 'Cartão', 'Mensalidade', s4_id, c4_id, CURRENT_DATE);
END $$;
