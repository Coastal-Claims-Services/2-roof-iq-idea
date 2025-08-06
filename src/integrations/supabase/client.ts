import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://llbeguvpfcdffklaqicf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsYmVndXZwZmNkZmZrbGFxaWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDUzNzcsImV4cCI6MjA2ODUyMTM3N30.-g61YTYFoKH7J3r8faBDAsJmzY4_gZft5kv36fP3U-U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)