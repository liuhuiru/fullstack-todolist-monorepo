-- 创建 todos 表
create table if not exists todos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 启用 Row Level Security
alter table todos enable row level security;

-- 创建策略：允许所有操作（演示用，生产环境需要基于用户权限）
create policy "Enable all operations for todos"
  on todos
  for all
  using (true)
  with check (true);

-- 创建更新时间触发器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_todos_updated_at
  before update on todos
  for each row
  execute function update_updated_at_column();
