import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import API from '../services/api'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [reports, setReports] = useState([])
  const [form, setForm] = useState({ title: '', category: 'Energy Efficiency', metric_value: '', notes: '' })

  const user = JSON.parse(localStorage.getItem('aq_user') || '{"id":2}')

  const loadData = async () => {
    const [a, r] = await Promise.all([API.get('/analytics/overview'), API.get('/reports')])
    setAnalytics(a.data)
    setReports(r.data)
  }

  useEffect(() => { loadData() }, [])

  const submitReport = async (e) => {
    e.preventDefault()
    await API.post('/reports', { ...form, user_id: user.id })
    setForm({ title: '', category: 'Energy Efficiency', metric_value: '', notes: '' })
    loadData()
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h2 className="text-3xl font-bold">Innovation Dashboard</h2>
      {analytics && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass p-4">Users: <b>{analytics.kpis.total_users}</b></div>
          <div className="glass p-4">Reports: <b>{analytics.kpis.total_reports}</b></div>
          <div className="glass p-4">Avg Metric: <b>{analytics.kpis.average_metric}</b></div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-4">{analytics && <Bar data={{labels: analytics.category_breakdown.map(i=>i.category),datasets:[{label:'Reports by Category',data: analytics.category_breakdown.map(i=>i.count)}]}} />}</div>
        <div className="glass p-4">{analytics && <Pie data={{labels: analytics.status_breakdown.map(i=>i.status),datasets:[{data: analytics.status_breakdown.map(i=>i.count)}]}} />}</div>
      </div>
      <form onSubmit={submitReport} className="glass p-6 grid md:grid-cols-2 gap-3">
        <h3 className="col-span-2 text-xl font-semibold">Submit Innovation Report</h3>
        <input className="p-2 rounded text-black" placeholder="Project title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
        <select className="p-2 rounded text-black" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>
          <option>Energy Efficiency</option><option>Sustainability</option><option>Automation</option><option>Safety</option>
        </select>
        <input className="p-2 rounded text-black" placeholder="Metric value" value={form.metric_value} onChange={(e)=>setForm({...form,metric_value:e.target.value})} />
        <input className="p-2 rounded text-black" placeholder="Notes" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} />
        <button className="bg-emerald-500 py-2 rounded col-span-2">Submit Report</button>
      </form>
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-3">Recent Reports</h3>
        <ul className="space-y-2 text-sm">{reports.slice(0,8).map(r=><li key={r.id}>• {r.title} ({r.category}) - {r.status}</li>)}</ul>
      </div>
    </main>
  )
}
