import { useEffect, useState } from 'react'
import API from '../services/api'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  useEffect(() => { API.get('/admin/users').then((res) => setUsers(res.data)) }, [])

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="glass p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <p className="text-sm text-slate-300 mb-4">Simple admin table for hackathon demo.</p>
        <table className="w-full text-left text-sm">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>{users.map(u => <tr key={u.id} className="border-t border-white/10"><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  )
}
