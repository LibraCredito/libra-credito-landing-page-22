create table if not exists public.conversations (
  conversation_id text primary key,
  agent_id text not null,
  simulation_id uuid references public.simulacoes(id),
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_secs integer,
  call_successful boolean,
  transcript_summary text,
  analysis jsonb,
  metadata jsonb
);

create table if not exists public.conversation_messages (
  id bigserial primary key,
  conversation_id text references public.conversations(conversation_id),
  role text check (role in ('user','assistant','system')),
  message text,
  time_in_call_secs integer,
  created_at timestamptz default now()
);
