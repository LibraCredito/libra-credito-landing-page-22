-- Schedules daily cleanup of visitor records lacking contact data.
-- Requires pg_cron extension enabled in the database.
select cron.schedule(
  'daily_anonymous_visitor_cleanup',
  '0 3 * * *',
  $$
    delete from leads
    where visitor_id is not null
      and email is null
      and phone is null
      and created_at < now() - interval '30 days';
  $$
);
