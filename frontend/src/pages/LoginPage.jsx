import { useState } from 'react'
import API from '../services/api'

export default function LoginPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [isSignup, setIsSignup] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login'
      const payload = isSignup ? form : { email: form.email, password: form.password }
      const { data } = await API.post(endpoint, payload)
      if (data.user) localStorage.setItem('aq_user', JSON.stringify(data.user))
      setMessage(data.message || 'Success')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <form onSubmit={submit} className="glass p-8 space-y-4">
        <h2 className="text-2xl font-bold">{isSignup ? 'Create Account' : 'Login'}</h2>
        {isSignup && <input className="w-full p-2 rounded text-black" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="w-full p-2 rounded text-black" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full p-2 rounded text-black" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full bg-cyan-500 py-2 rounded font-semibold">{isSignup ? 'Sign up' : 'Log in'}</button>
        <button type="button" className="text-sm underline" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </button>
        {message && <p className="text-sm text-cyan-200">{message}</p>}
      </form>
    </main>
  )
}
