'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from "next/link";


export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    checkUser()

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('auth event', event, session)
      setUser(session?.user ?? null)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)
    setUsername(user?.user_metadata?.username ?? '')
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for confirmation!')
    }
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      checkUser()
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setUsername('')
  }

  if (!user) {
    return (
      <main className="p-6 max-w-sm mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Diet Tracker Login
        </h1>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded mr-2"
          onClick={signIn}
        >
          Login
        </button>

        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={signUp}
        >
          Sign Up
        </button>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome {username}
      </h1>

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={signOut}
      >
        Logout
      </button>
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {[
            { name: 'Weight', href: '/weight' },
            { name: 'Meal', href: '/meal' },
            { name: 'Water', href: '/water' },
            { name: 'Exercise', href: '/exercise' },
            { name: 'Sleep', href: '/sleep' },
            { name: 'Friends', href: '/friends' },
          ].map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              {section.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}