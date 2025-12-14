import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  let userProfile = profile

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert([{ id: user.id, full_name: "", phone: "" }])
      .select()
      .maybeSingle()

    userProfile = newProfile
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Edit Profile</h1>
          <ProfileForm profile={userProfile} userId={user.id} userEmail={user.email || ""} />
        </div>
      </div>
    </div>
  )
}
