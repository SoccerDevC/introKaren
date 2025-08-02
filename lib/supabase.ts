import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export type Pledge = {
  id: string
  name: string
  amount: number
  message: string
  photo_url?: string
  created_at: string
}

// Mock data for when Supabase isn't configured
export const mockPledges: Pledge[] = [
  {
    id: "1",
    name: "Sarah & Michael",
    amount: 50000,
    message: "Wishing you both endless love and happiness! 💕",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "The Johnson Family",
    amount: 100000,
    message: "May your love story be as beautiful as today! 🌹",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    name: "Grace & David",
    amount: 50000,
    message: "Congratulations on this special day! ✨",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

// Upload file to Supabase Storage
export async function uploadFile(file: File, bucket = "pledge-photos"): Promise<string | null> {
  if (!supabase) return null

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage.from(bucket).upload(filePath, file)

  if (error) {
    console.error("Error uploading file:", error)
    return null
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return data.publicUrl
}
