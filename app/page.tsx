'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from "next/link"


export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<any | null>(null)
  const sections = [
    { name: 'Weight', href: '/weight', icon: '/window.svg' },
    { name: 'Meal', href: '/meal', icon: '/file.svg' },
    { name: 'Water', href: '/water', icon: '/globe.svg' },
    { name: 'Exercise', href: '/exercise', icon: '/vercel.svg' },
    { name: 'Sleep', href: '/sleep', icon: '/next.svg' },
    { name: 'Friends', href: '/friends', icon: '/window.svg' },
  ]

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
      <main className="page-shell">
        <div className="page-card auth-layout page-card--center">
          <h1 className="page-title">Diet Tracker Login</h1>

          <div className="auth-stack">
            <input
              className="field"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-row">
              <button className="button button--primary" onClick={signIn}>
                Login
              </button>

              <button className="button button--secondary" onClick={signUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell page-shell--top">
      <div className="page-card dashboard-layout page-card--left">
        <h1 className="page-title">Welcome {username}!</h1>

        <div>
          <div className="section-grid">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="section-link"
              >
                <img
                  src={"/images/phone.png"}
                  alt=""
                  aria-hidden="true"
                  className="section-link__icon"
                />
                {section.name}
              </Link>
            ))}
          </div>
        </div>

        <button className="button button--danger" onClick={signOut}>
          Logout
        </button>
      </div>
    </main>
  )
}