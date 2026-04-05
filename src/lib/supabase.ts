import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase Project URL and Anon/Public Key
const supabaseUrl = 'https://iwsfkufdeoyirhsmoorh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2ZrdWZkZW95aXJoc21vb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDA1MjksImV4cCI6MjA5MDk3NjUyOX0.9ColWxAhOXwdM1mVgcyofPvrHvJlPoGUgCz-wj3KY90';

export const supabase = createClient(supabaseUrl, supabaseKey);