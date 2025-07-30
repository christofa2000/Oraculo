import { createClient } from '@supabase/supabase-js'

// Reemplaza estos con tus datos reales:
const supabaseUrl = 'https://itlyepkflrmkerqnawjp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bHllcGtmbHJta2VycW5hd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NzQyMjAsImV4cCI6MjA2NzI1MDIyMH0.dvfW9BDMygHlkplvOTScnaFXyszqLQzTxZD_XojjwKY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
