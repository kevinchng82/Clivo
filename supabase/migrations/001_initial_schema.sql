create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null unique,
  owner_whatsapp text not null,
  whatsapp_phone_number_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial','active','past_due','cancelled')),
  pdpa_consent boolean not null default false,
  pdpa_consent_at timestamptz,
  created_at timestamptz default now(),
  check (pdpa_consent = false or pdpa_consent_at is not null)
);

create table clinic_settings (
  clinic_id uuid primary key references clinics(id) on delete cascade,
  business_hours jsonb default '{"mon":"9am-6pm","tue":"9am-6pm","wed":"9am-6pm","thu":"9am-6pm","fri":"9am-6pm","sat":"9am-1pm","sun":"closed"}',
  services jsonb default '[]',
  faqs jsonb default '[]',
  updated_at timestamptz default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  customer_phone text not null,
  state text default 'idle',
  context jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(clinic_id, customer_phone)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  customer_phone text not null,
  customer_name text,
  service text,
  appointment_dt timestamptz not null,
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- Immutable audit log — append-only, never updated or deleted
create table audit_log (
  id bigserial primary key,
  clinic_id uuid references clinics(id) on delete set null,
  event text not null,
  actor text,
  detail jsonb default '{}',
  created_at timestamptz default now()
);

-- Auto-refresh updated_at triggers
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger clinic_settings_updated_at
  before update on clinic_settings
  for each row execute function set_updated_at();

create trigger conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- Performance indexes
create index on conversations(clinic_id);
create index on conversations(customer_phone);
create index on bookings(clinic_id);
create index on bookings(appointment_dt);
create index on audit_log(clinic_id);

-- Enable RLS on all tables
alter table clinics enable row level security;
alter table clinic_settings enable row level security;
alter table conversations enable row level security;
alter table bookings enable row level security;
alter table audit_log enable row level security;

-- Deny-all policies for anon role (service_role bypasses RLS by default)
create policy "deny_anon_clinics" on clinics for all to anon using (false);
create policy "deny_anon_clinic_settings" on clinic_settings for all to anon using (false);
create policy "deny_anon_conversations" on conversations for all to anon using (false);
create policy "deny_anon_bookings" on bookings for all to anon using (false);
create policy "deny_anon_audit_log" on audit_log for all to anon using (false);

-- audit_log: insert allowed, update/delete explicitly denied for all non-service roles
create policy "audit_log_insert_only" on audit_log for insert with check (true);
create policy "deny_update_audit_log" on audit_log for update using (false);
create policy "deny_delete_audit_log" on audit_log for delete using (false);
