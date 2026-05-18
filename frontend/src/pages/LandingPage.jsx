export default function LandingPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <section className="glass p-10">
        <h2 className="text-4xl font-bold mb-4">Engineering Innovation Challenge 2026</h2>
        <p className="text-slate-200 mb-6">
          Teams struggle to track, compare, and scale innovation ideas across energy, automation, and sustainability projects.
          AtomQuest Portal gives one workspace for submitting reports, visualizing metrics, and coordinating leadership decisions.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="glass p-4">Problem: scattered reports and no visibility.</div>
          <div className="glass p-4">Solution: unified submission + analytics dashboard.</div>
          <div className="glass p-4">Impact: faster approvals and better innovation ROI.</div>
        </div>
      </section>
    </main>
  )
}
