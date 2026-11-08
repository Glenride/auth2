import { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import type { SharedData } from '@/types';

type ProjectSummary = {
    name: string;
    subtitle: string;
    challenge: string;
    build: string[];
    result: string[];
    url?: string;
};

const credibilityPoints = [
    'Keeps multi-site trials inspection-ready by catching issues early',
    'Builds growth systems that turn cold traffic into qualified pipeline',
    "Delivers creative that translates technical nuance into deals",
];

const brandPillars = [
    {
        title: 'Research rigor',
        description:
            'I eliminate protocol deviations before they trigger audit findings, protecting timelines and data integrity.',
    },
    {
        title: 'Systems that scale',
        description:
            'I architect full-stack marketing engines—strategy, copy, sites, analytics—so you get a complete revenue system.',
    },
    {
        title: 'Creative precision',
        description:
            "I bring a performer's discipline to storytelling, turning complexity into narratives teams and buyers act on.",
    },
];

const projectSummaries: ProjectSummary[] = [
    {
        name: 'HVAC Repair Network',
        subtitle: 'Lead generation system for multi-location service providers',
        challenge: 'Partners had empty calendars and inconsistent quote flow.',
        build: [
            'Conversion-optimized local landing pages with booking flows',
            'Call tracking and lead routing infrastructure',
            'Real-time analytics dashboards for partner performance',
        ],
        result: ['[X% increase in qualified leads monthly]', '[Cost per lead dropped X% in Y weeks]'],
        url: 'https://hvacrepair-cincinnati-oh.com',
    },
    {
        name: 'Innovate for Good',
        subtitle: 'Complete marketing operating system for social impact initiative',
        challenge: 'Fragmented tools, manual workflows, and zero visibility into what drove donations.',
        build: [
            'CRM with segmentation and automated email sequences',
            'Donation funnels plus a living content calendar',
            'Single analytics dashboard for all performance data',
        ],
        result: [
            '[Subscriber growth of X%]',
            '[Conversion improved from A% to B%]',
            '[Saved X hours monthly through automation]',
        ],
        url: 'https://innovateforgood.uk',
    },
    {
        name: 'Rapid Impact Accelerator',
        subtitle: 'Sprint framework: concept to first sale in under 30 days',
        challenge: 'Teams stalled in planning mode, burning runway without validation.',
        build: [
            'Premium offer positioning and pricing',
            'Landing page, conversion copy, and traffic plan',
            'Measurement loop for validated learning',
        ],
        result: [
            '[First sale in X days]',
            '[CAC reduced X% after iteration 2]',
            '[Time-to-ship compressed from A weeks to B]',
        ],
        url: 'https://dvaughnhouse.store',
    },
];

const services = [
    {
        title: 'Research & Clinical Operations',
        items: [
            'Site audits that surface deviations before inspections',
            'Protocol and process design for cleaner, faster data',
            'Dashboards that give leads real-time decision power',
        ],
    },
    {
        title: 'Growth Systems',
        items: [
            'End-to-end funnel builds from positioning to deployment',
            'Automation, CRM, and analytics stitched into one view',
            'Conversion experiments to scale what works, cut what doesn’t',
        ],
    },
    {
        title: 'Voice & Creative',
        items: [
            'Studio-ready vocals and audio production',
            'Brand voice systems for launches and campaigns',
            'Story-driven content that moves deals forward',
        ],
    },
];

const skills = [
    'Clinical ops + site performance',
    'End-to-end funnel architecture',
    'Automation & CRM builds',
    'Analytics and dashboards',
    'Conversion copywriting',
    'Vocal performance & audio production',
];

const processSteps = [
    {
        title: 'Discover',
        description: 'We align on your commercial goal and constraints—not my process.',
    },
    {
        title: 'Design',
        description: 'I architect the minimum viable system to prove value fast.',
    },
    {
        title: 'Build',
        description: 'You get a working version in weeks, not a roadmap in months.',
    },
    {
        title: 'Optimize',
        description: 'We double down on what converts, and cut what doesn’t.',
    },
];

const testimonials = [
    {
        quote: '“He turned a tangled trial rollout into a clean, inspection-ready operation.”',
        attribution: '[Name, Title]',
    },
    {
        quote: '“Our marketing finally runs like a system. Leads doubled without adding headcount.”',
        attribution: '[Name, Company]',
    },
    {
        quote: '“Direct, disciplined, and creative. Every deliverable moved revenue forward.”',
        attribution: '[Name, Team]',
    },
];

const contactCtas = ['Start a project', 'Book 15 minutes', 'Request the portfolio PDF'];

export default function Welcome() {
    const { flash, auth, name } = usePage<SharedData>().props;
    const successMessage = typeof flash?.success === 'string' ? flash.success : null;
    const isAuthenticated = Boolean(auth?.user);
    const brandName =
        typeof name === 'string' && name.trim().length > 0 && name !== 'Laravel'
            ? name
            : "D'Vaughn House";

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const activeSuccessMessage =
        successMessage ?? (recentlySuccessful ? "Thanks for reaching out\! I'll reply soon." : null);

    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head title="Less bureaucracy. More breakthroughs." />

            <main className="bg-background text-foreground">
                <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted px-6 md:px-10">
                    <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
                        <div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-6xl py-16 md:py-24">
                        <header className="flex items-center justify-between gap-4">
                            <span className="text-lg font-semibold tracking-tight text-foreground">{brandName}</span>

                            <nav className="hidden items-center gap-6 md:flex">
                                <a href="/" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Home
                                </a>
                                <a href="#services" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Services
                                </a>
                                <Link href="/links" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Links
                                </Link>
                                <a href="#contact" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Contact
                                </a>
                            </nav>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-border/60 px-5 py-2 text-sm font-semibold"
                                    asChild
                                >
                                    <a href="#contact">Get in touch</a>
                                </Button>

                                {isAuthenticated ? (
                                    <Link
                                        href={dashboard().url}
                                        className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-foreground transition hover:border-border hover:bg-background/60"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login().url}
                                        className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-foreground transition hover:border-border hover:bg-background/60"
                                    >
                                        Log in
                                    </Link>
                                )}
                            </div>
                        </header>

                        <div className="mt-12 space-y-8 text-center md:mt-16">
                            <div className="space-y-4">
                                <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                                    Stop losing momentum to chaos.
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                                    I transform complexity into revenue—whether you’re running trials, scaling a business,
                                    or launching creative work.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                <Button
                                    className="rounded-full px-8 py-3 text-base font-semibold shadow-md shadow-primary/20"
                                    asChild
                                >
                                    <a href="#projects">Explore projects</a>
                                </Button>
                                <Button variant="outline" className="rounded-full px-7 py-3 text-base" asChild>
                                    <a href="#contact">Start a conversation</a>
                                </Button>
                            </div>
                        </div>

                        <div className="mt-16 grid gap-4 md:grid-cols-3">
                            {credibilityPoints.map((point) => (
                                <div
                                    key={point}
                                    className="group flex h-full flex-col gap-3 rounded-3xl border border-border/60 bg-card/70 p-6 text-left shadow-sm transition hover:border-primary/40 hover:bg-card/80"
                                >
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                                        {point.charAt(0)}
                                    </span>
                                    <p className="text-sm text-muted-foreground">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-10">
                        <div className="max-w-2xl space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Operating lanes
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">Three disciplines. One operating system.</h2>
                            <p className="text-base text-muted-foreground md:text-lg">
                                Each engagement blends research rigor, scalable systems, and creative precision.
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {brandPillars.map((pillar) => (
                                <div
                                    key={pillar.title}
                                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/70 p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-t border-border bg-muted/40 px-6 py-16 md:px-10">
                    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[3fr_2fr] md:items-start">
                        <div className="space-y-5 text-base text-muted-foreground md:text-lg">
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Why teams call me</h2>
                            <p>
                                In Big Pharma, I keep multi-site trials inspection-ready by spotting quality risks before
                                they derail timelines or submissions.
                            </p>
                            <p>
                                As a self-taught technologist, I ship lean growth engines—positioning, copy, site builds,
                                analytics—so you get a complete system, not scattered tactics.
                            </p>
                            <p>
                                As a trained vocalist, I deliver emotional precision that carries into brand voice, product
                                launches, and stakeholder storytelling.
                            </p>
                            <p className="font-medium text-foreground">I don’t experiment with your budget. I deploy what converts.</p>
                        </div>

                        <div className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Testimonials (placeholders)
                            </h3>
                            <div className="space-y-5">
                                {testimonials.map((testimonial) => (
                                    <blockquote key={testimonial.quote} className="space-y-2">
                                        <p className="text-base font-medium text-foreground">{testimonial.quote}</p>
                                        <footer className="text-sm text-muted-foreground">{testimonial.attribution}</footer>
                                    </blockquote>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects" className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-10">
                        <div className="max-w-3xl space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Projects
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">
                                Case studies that turn strategy into repeatable results.
                            </h2>
                        </div>
                        <div className="space-y-8">
                            {projectSummaries.map((project) => (
                                <a
                                    key={project.name}
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block space-y-5 rounded-2xl border border-border bg-card/70 p-6 shadow-sm transition hover:border-primary/40 hover:bg-card/80"
                                >
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-semibold transition group-hover:text-primary">{project.name}</h3>
                                            <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Challenge</p>
                                        <p className="text-sm text-muted-foreground">{project.challenge}</p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                Build
                                            </h4>
                                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                                {project.build.map((item: string) => (
                                                    <li key={item} className="flex gap-2">
                                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                Result
                                            </h4>
                                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                                {project.result.map((outcome: string) => (
                                                    <li key={outcome} className="flex gap-2">
                                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                                        <span>{outcome}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                className="rounded-full px-8 py-3 text-base font-semibold"
                                asChild
                            >
                                <Link href="/links">View all projects</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section id="services" className="border-t border-border bg-muted/30 px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-10">
                        <div className="max-w-3xl space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Services
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">Where rigor meets momentum.</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {services.map((service) => (
                                <div
                                    key={service.title}
                                    className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-semibold">{service.title}</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {service.items.map((item) => (
                                            <li key={item} className="flex gap-2">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-border bg-card/70 p-8 shadow-sm">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Selected Skills & Tools
                            </p>
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Operator-level skills across research, systems, and sound.</h2>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {skills.map((skill) => (
                                <div
                                    key={skill}
                                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-t border-border bg-muted/20 px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-10">
                        <div className="max-w-3xl space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Process
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">The loop that keeps momentum.</h2>
                        </div>
                        <ol className="grid gap-6 md:grid-cols-4">
                            {processSteps.map((step, index) => (
                                <li
                                    key={step.title}
                                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-6 shadow-sm"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-6 rounded-2xl border border-border bg-card/70 p-8 shadow-sm">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Vocalist Spotlight
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">From studio to stage, I bring precision and presence.</h2>
                        </div>
                        <p className="text-base text-muted-foreground md:text-lg">
                            I record with Apple Pro tools, arrange harmonies, and deliver performances that carry the story.
                            Need a voice for your brand, your track, or your event? Let’s talk.
                        </p>
                    </div>
                </section>

                <section id="contact" className="border-t border-border bg-muted/10 px-6 py-20 md:px-10">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Contact
                            </p>
                            <h2 className="text-3xl font-semibold md:text-4xl">Ready to move faster?</h2>
                            <p className="text-base text-muted-foreground md:text-lg">
                                Tell me what’s blocking your next breakthrough—trial integrity, pipeline growth, or creative
                                production—and we’ll design a path to measurable impact.
                            </p>
                        </div>

                        <div className="space-y-6 rounded-2xl border border-border bg-background p-8 shadow-sm">
                            {activeSuccessMessage && (
                                <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                                    {activeSuccessMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                                            Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            autoComplete="name"
                                            required
                                            aria-invalid={Boolean(errors.name)}
                                            aria-describedby={errors.name ? 'name-error' : undefined}
                                        />
                                        <InputError id="name-error" message={errors.name} className="text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            autoComplete="email"
                                            required
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                        />
                                        <InputError id="email-error" message={errors.email} className="text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={data.message}
                                        onChange={(event) => setData('message', event.target.value)}
                                        placeholder="Share goals, constraints, timelines, and any links you want me to review."
                                        required
                                        aria-invalid={Boolean(errors.message)}
                                        aria-describedby={errors.message ? 'message-error' : undefined}
                                        className="min-h-[160px]"
                                    />
                                    <InputError id="message-error" message={errors.message} className="text-sm" />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        {contactCtas.map((cta) => (
                                            <span
                                                key={cta}
                                                className="rounded-full border border-dashed border-border px-3 py-1"
                                            >
                                                {cta}
                                            </span>
                                        ))}
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Sending…' : 'Submit message'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border bg-background px-6 py-10 md:px-10">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                        <span>Less bureaucracy. More breakthroughs.</span>
                        <span>&copy; {currentYear} D'Vaughn House. All rights reserved.</span>
                    </div>
                </footer>
            </main>
        </>
    );
}
