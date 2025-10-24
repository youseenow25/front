export default function Pricing() {
return (
<section id="pricing" className="container-hero py-20">
<h2 className="h2">Simple pricing</h2>
<p className="muted mt-4 max-w-2xl">Start free. Upgrade when you’re ready to automate at scale.</p>

<div className="mt-10 grid gap-6 sm:grid-cols-2">
<div className="card p-6">
<div className="text-white/70 text-sm">Starter</div>
<div className="mt-2 text-4xl font-semibold">$0</div>
<ul className="mt-4 space-y-2 text-sm text-white/70">
<li>• 100 tasks / month</li>
<li>• 3 templates</li>
<li>• Community support</li>
</ul>
<a className="btn btn-primary mt-6 w-full justify-center" href="#">Start Free</a>
</div>

<div className="card p-6 border-white/20">
<div className="text-white/70 text-sm">Pro</div>
<div className="mt-2 text-4xl font-semibold">$29<span className="text-base text-white/50">/mo</span></div>
<ul className="mt-4 space-y-2 text-sm text-white/70">
<li>• 10k tasks / month</li>
<li>• 50+ templates</li>
<li>• Priority support</li>
</ul>
<a className="btn btn-primary mt-6 w-full justify-center" href="#">Get Pro</a>
</div>
</div>
</section>
)
}