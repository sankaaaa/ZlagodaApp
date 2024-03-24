import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qlyuxputrdmikamgcowo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXV4cHV0cmRtaWthbWdjb3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExODE4NjMsImV4cCI6MjAyNjc1Nzg2M30.fYvd2ihfiCp0k-2T9lL6AO8lE5mKzHqH_GOmQTC6CRI';
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;