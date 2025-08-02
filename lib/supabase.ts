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

// Enhanced mock data for when Supabase isn't configured or table doesn't exist
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
    amount: 75000,
    message: "Congratulations on this special day! ✨",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "4",
    name: "Auntie Rose",
    amount: 200000,
    message: "Karen, you are a blessing to our family! 👑",
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "5",
    name: "Best Friends Forever",
    amount: 150000,
    message: "We love you so much Karen! Can't wait to celebrate! 💖",
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
]

// Check if the pledges table exists
export async function checkTableExists(): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.from("pledges").select("id").limit(1)

    return !error
  } catch (error) {
    console.log("Table check failed:", error)
    return false
  }
}

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
