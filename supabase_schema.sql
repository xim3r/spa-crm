-- ═══════════════════════════════════════════════════
-- SPA CRM - SCHEMA COMPLETO PARA SUPABASE
-- Ejecuta esto en Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════

-- 1. TABLA DE PERFILES DE USUARIO (roles)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  nombre text,
  rol text default 'recepcionista' check (rol in ('admin', 'recepcionista', 'especialista')),
  activo boolean default true,
  created_at timestamptz default now()
);

-- Trigger: crear perfil automáticamente al registrar usuario
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nombre)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. CLIENTES / EXPEDIENTES
create table public.clients (
  id text primary key default 'C' || upper(substr(gen_random_uuid()::text, 1, 6)),
  nombre text not null,
  telefono text,
  email text,
  fecha_nac date,
  tipo_piel text,
  alergias text,
  antecedentes text,
  diagnostico text,
  consentimiento boolean default false,
  requiere_factura boolean default false,
  rfc text,
  razon_social text,
  direccion_fiscal text,
  uso_cfdi text,
  email_factura text,
  activo boolean default true,
  credito numeric default 0,
  deuda numeric default 0,
  created_at timestamptz default now()
);

-- 3. SERVICIOS
create table public.servicios (
  id text primary key default 'S' || upper(substr(gen_random_uuid()::text, 1, 6)),
  nombre text not null,
  categoria text,
  precio numeric default 0,
  duracion integer default 60,
  descripcion text,
  activo boolean default true,
  created_at timestamptz default now()
);

-- 4. PRODUCTOS / INVENTARIO
create table public.productos (
  id text primary key default 'P' || upper(substr(gen_random_uuid()::text, 1, 6)),
  nombre text not null,
  marca text,
  sku text,
  categoria text,
  precio numeric default 0,
  stock integer default 0,
  stock_min integer default 3,
  caducidad date,
  tipo text default 'kbeauty' check (tipo in ('kbeauty', 'insumo')),
  activo boolean default true,
  created_at timestamptz default now()
);

-- 5. STAFF / ESPECIALISTAS
create table public.staff (
  id text primary key default 'E' || upper(substr(gen_random_uuid()::text, 1, 6)),
  nombre text not null,
  especialidad text,
  comision numeric default 20,
  activo boolean default true,
  user_id uuid references auth.users,
  created_at timestamptz default now()
);

-- 6. CITAS / AGENDA
create table public.citas (
  id text primary key default 'A' || upper(substr(gen_random_uuid()::text, 1, 6)),
  cliente_id text references public.clients,
  servicio_id text references public.servicios,
  especialista_id text references public.staff,
  cabina text default 'Sin cabina',
  fecha date not null,
  inicio time,
  fin time,
  estado text default 'Pendiente' check (estado in ('Pendiente','Confirmada','Completada','Cancelada')),
  precio numeric default 0,
  notas text,
  created_at timestamptz default now()
);

-- 7. TICKETS DE VENTA
create table public.tickets (
  id text primary key default 'T' || upper(substr(gen_random_uuid()::text, 1, 6)),
  folio text unique,
  cliente_id text references public.clients,
  especialista_id text references public.staff,
  metodo_pago text default 'Efectivo',
  descuento numeric default 0,
  total numeric default 0,
  fecha date default current_date,
  folio_tarjeta text,
  created_at timestamptz default now()
);

-- 8. ITEMS DEL TICKET
create table public.ticket_items (
  id uuid primary key default gen_random_uuid(),
  ticket_id text references public.tickets on delete cascade,
  tipo text check (tipo in ('servicio','producto')),
  ref_id text,
  nombre text,
  precio numeric,
  qty integer default 1
);

-- 9. PROMOCIONES
create table public.promos (
  id text primary key default 'PR' || upper(substr(gen_random_uuid()::text, 1, 6)),
  codigo text unique not null,
  tipo text default 'porcentaje' check (tipo in ('porcentaje','monto')),
  valor numeric default 10,
  activo boolean default true,
  expira date,
  usos integer default 0,
  descripcion text,
  created_at timestamptz default now()
);

-- 10. CAMPAÑAS / PLANTILLAS
create table public.campanas (
  id text primary key default 'CA' || upper(substr(gen_random_uuid()::text, 1, 6)),
  nombre text not null,
  plantilla text,
  variables text[],
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY (solo usuarios autenticados)
-- ═══════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.servicios enable row level security;
alter table public.productos enable row level security;
alter table public.staff enable row level security;
alter table public.citas enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_items enable row level security;
alter table public.promos enable row level security;
alter table public.campanas enable row level security;

-- Políticas: solo usuarios autenticados pueden leer/escribir
create policy "auth_read" on public.profiles for select using (auth.role() = 'authenticated');
create policy "auth_read" on public.clients for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.servicios for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.productos for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.staff for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.citas for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.tickets for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.ticket_items for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.promos for all using (auth.role() = 'authenticated');
create policy "auth_read" on public.campanas for all using (auth.role() = 'authenticated');

-- Permitir actualizar propio perfil
create policy "own_profile" on public.profiles for update using (auth.uid() = id);

-- ═══════════════════════════════════════════════
-- DATOS DEMO INICIALES (opcional, bórralos después)
-- ═══════════════════════════════════════════════

insert into public.servicios (nombre, categoria, precio, duracion, descripcion) values
  ('Limpieza Facial Profunda', 'Facial', 850, 60, 'Limpieza completa con extracción y mascarilla'),
  ('Mesoterapia Facial', 'Facial', 1200, 45, 'Microinyecciones con vitaminas y ácido hialurónico'),
  ('Masaje Relajante', 'Masaje', 700, 60, 'Masaje corporal con aceites esenciales'),
  ('Depilación Láser', 'Aparatología', 1500, 30, 'Depilación con láser Alexandrita'),
  ('Botox', 'Tratamiento Médico', 4500, 30, 'Aplicación de toxina botulínica'),
  ('Hydrafacial', 'Facial', 1800, 75, 'Limpieza + hidratación profunda');

insert into public.productos (nombre, marca, sku, categoria, precio, stock, stock_min, caducidad, tipo) values
  ('Sérum Vitamina C', 'The Ordinary', 'TO-VC-001', 'Esencias & Sueros', 320, 12, 3, '2025-12-01', 'kbeauty'),
  ('Protector Solar SPF 50', 'Isdin', 'IS-SPF-001', 'Protección Solar', 580, 2, 5, '2025-08-15', 'kbeauty'),
  ('Mascarilla Colágeno', 'Mediheal', 'MH-COL-001', 'Mascarillas', 95, 45, 10, '2026-03-20', 'kbeauty'),
  ('Ácido Hialurónico 10ml', 'Aliaxin', 'AL-HA-001', 'Insumos médicos', 2200, 1, 3, '2024-09-01', 'insumo'),
  ('Agujas 30G x100', 'BD', 'BD-30G-100', 'Insumos médicos', 450, 8, 2, '2027-01-01', 'insumo');
