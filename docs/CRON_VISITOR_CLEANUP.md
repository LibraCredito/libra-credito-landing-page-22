# Cron job for anonymous visitor cleanup

An edge function `cleanup-anonymous-visitors` removes records that only have a `visitor_id` and no contact details after a retention period.

## Schedule

Run the SQL script `database/sql/supabase-schedule-anonymous-cleanup.sql` in your project to register a daily job. The job executes at 03:00 UTC and purges entries older than 30 days.

Adjust the schedule or retention days by editing the script or setting the `ANON_VISITOR_RETENTION_DAYS` environment variable used by the edge function.
