export default function Features() {
const items = [
{
title: 'Receipt Generator',
desc: 'Pixel‑perfect 1:1 receipts with auditable metadata and exportable PDFs.'
},
{
title: 'Emulator Orchestration',
desc: 'Spin up sandboxed device sessions, script flows, and replay them at scale.'
},
{
title: 'Reseller Toolkit',
desc: 'A curated suite of utilities, templates, and monitoring built for high throughput.'
}
]

return (
<section id="features" className="container-hero py-20">
<h2 className="h2">Everything you need to scale</h2>
<p className="muted mt-4 max-w-2xl">Fast, opinionated, and secure building blocks that feel native to your workflow.</p>
<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{items.map((f) => (
<article key={f.title} className="card p-6">
<div className="text-lg font-medium">{f.title}</div>
<p className="muted mt-2">{f.desc}</p>
</article>
))}
</div>
</section>
)
}