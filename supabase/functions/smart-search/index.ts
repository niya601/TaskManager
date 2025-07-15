import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, userId } = await req.json()

    if (!query || !userId) {
      return new Response(
        JSON.stringify({ error: 'Query and userId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate embedding for the search query using Supabase AI
    const model = new Supabase.ai.Session('gte-small')
    const queryEmbedding = await model.run(query, { mean_pool: true, normalize: true })

    // Perform vector similarity search on tasks
    const { data: similarTasks, error: searchError } = await supabase.rpc('search_tasks_by_similarity', {
      query_embedding: queryEmbedding,
      user_id: userId,
      match_threshold: 0.3,
      match_count: 5
    })

    if (searchError) {
      console.error('Search error:', searchError)
      return new Response(
        JSON.stringify({ error: 'Search failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ results: similarTasks || [] }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in smart-search function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})