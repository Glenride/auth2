import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

type LinkItem = {
    name: string;
    url: string;
    description: string;
    cta: string;
    comingSoon?: boolean;
    badge?: string;
};

const featuredBuilds: LinkItem[] = [
    {
        name: 'Innovate for Good',
        url: 'https://innovateforgood.uk',
        description:
            'The research-backed marketing system that turns high-intent searches into booked appointments—automatically. Grounded in Harvard Business Review, Google Research, and a 2,200-company analysis.',
        cta: 'See the system',
    },
    {
        name: 'HVAC Repair Network (Cincinnati)',
        url: 'https://hvacrepair-cincinnati-oh.com',
        description:
            'Emergency HVAC repair across Cincinnati and Hamilton County. A 24/7 network of state-licensed pros for fast, reliable service.',
        cta: 'Request emergency service',
    },
    {
        name: 'Profile Conversion Sprint',
        url: 'https://dvaughnhouse.store',
        description:
            'Wake up to a high-converting profile—tomorrow. Professional copy, search-smart positioning, and 1:1 coaching.',
        cta: 'Book your sprint',
    },
];

const portfolioHub: LinkItem[] = [
    {
        name: 'Main Portfolio',
        url: 'https://dvaughnhouse.com',
        description: 'Research rigor, systems builds, and creative work—one portfolio, measurable outcomes.',
        cta: 'Explore my work',
    },
];

const appsAndExperiments: LinkItem[] = [
    {
        name: 'Emoji Verdict',
        url: 'https://emojiverdict.onrender.com',
        description: 'A playful logic game: complete the case file and get a verdict—using only emojis.',
        cta: 'Play now',
    },
    {
        name: 'Glenride (Reddit-style forum clone)',
        url: 'https://glenride.onrender.com',
        description: 'A minimal, fast community prototype for threaded discussions and voting.',
        cta: 'Explore the demo',
    },
];

const comingSoon: LinkItem[] = [
    {
        name: 'Tandem',
        url: 'https://glassrose.uk',
        description:
            'Human + AI chat that routes to a real person when it matters—your always-on co-pilot.',
        cta: 'Join the waitlist',
        comingSoon: true,
        badge: 'coming soon',
    },
    {
        name: 'Perrymill',
        url: 'https://perrymill-ui.pages.dev',
        description: 'Real-time news with signal over noise. Native app coming later; web demo available now.',
        cta: 'Try the web demo',
        badge: 'web demo',
    },
];

function LinkCard({ item }: { item: LinkItem }) {
    return (
        <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 shadow-sm transition hover:border-primary/40 hover:bg-card/80">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                        {item.badge && (
                            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
            </div>

            <div className="mt-auto">
                <Button
                    variant="outline"
                    className="group/btn w-full rounded-full px-5 py-2 text-sm font-semibold transition"
                    asChild
                >
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                </Button>
            </div>
        </div>
    );
}

export default function Links() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head title="Links — All projects in one place" />

            <main className="bg-background text-foreground">
                {/* Header */}
                <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-muted px-6 md:px-10">
                    <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
                        <div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-6xl py-16 md:py-24">
                        <header className="flex items-center justify-between gap-4">
                            <span className="text-lg font-semibold tracking-tight text-foreground">D'Vaughn House</span>

                            <nav className="hidden items-center gap-6 md:flex">
                                <Link href="/" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Home
                                </Link>
                                <Link href="/#services" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Services
                                </Link>
                                <Link href="/links" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Links
                                </Link>
                                <Link href="/#contact" className="text-sm font-medium text-foreground/80 transition hover:text-foreground">
                                    Contact
                                </Link>
                            </nav>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-border/60 px-5 py-2 text-sm font-semibold"
                                    asChild
                                >
                                    <Link href="/#contact">Get in touch</Link>
                                </Button>
                            </div>
                        </header>

                        <div className="mt-12 space-y-6 text-center md:mt-16">
                            <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                                All projects in one place
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                                Research-backed systems, creative experiments, and tools built for real-world outcomes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured builds */}
                <section className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Featured builds
                            </p>
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                                Systems that scale
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredBuilds.map((item) => (
                                <LinkCard key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio hub */}
                <section className="border-t border-border bg-muted/30 px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Portfolio hub
                            </p>
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                                The full story
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-1">
                            {portfolioHub.map((item) => (
                                <LinkCard key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Apps & experiments */}
                <section className="px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Apps & experiments
                            </p>
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                                Built for fun and learning
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {appsAndExperiments.map((item) => (
                                <LinkCard key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Coming soon */}
                <section className="border-t border-border bg-muted/30 px-6 py-16 md:px-10">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                Coming soon
                            </p>
                            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                                Join the waitlist
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {comingSoon.map((item) => (
                                <LinkCard key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
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
