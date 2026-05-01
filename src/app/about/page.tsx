import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export const metadata = {
    title: 'About Us — Nimantran Studio',
    description: 'Learn about Nimantran Studio — built for Indian families who want beautiful, effortless digital wedding invitations.',
};

export default function AboutPage() {
    return (
        <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

            {/* Hero */}
            <section style={{
                background: 'var(--secondary)',
                color: '#fff',
                padding: '5rem 1.5rem 4rem',
                textAlign: 'center',
            }}>
                <div className="container">
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: '#C8A951', marginBottom: '1rem', fontWeight: 600 }}>
                        OUR STORY
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem' }}>
                        Built for Indian Families,<br />by an Indian Family
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#CBD5E1', maxWidth: '600px', margin: '0 auto', lineHeight: 1.75 }}>
                        Nimantran Studio started with a simple question: why is sharing a wedding invitation still so complicated? We built the answer.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div className="container" style={{ maxWidth: '780px', margin: '0 auto' }}>
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        WHAT WE BELIEVE
                    </p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                        Every wedding deserves a beautiful invitation — not just a WhatsApp forward
                    </h2>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1.25rem' }}>
                        Indian weddings are full of colour, ceremony, and love — but the invitation process was stuck in the past. Couples were either printing expensive cards or sending plain text messages. We wanted something in between: elegant, digital, and effortlessly shareable on WhatsApp.
                    </p>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1.25rem' }}>
                        Nimantran Studio lets you create a personalised invitation in minutes, share it with your entire guest list in one tap, and track RSVPs from your phone — so you can focus on the wedding, not the spreadsheet.
                    </p>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem' }}>
                        We're a small team based in Pune, Maharashtra. Every feature we ship is one that we'd want for our own family's wedding.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section style={{ padding: '4rem 1.5rem', background: '#F1EDE4' }}>
                <div className="container">
                    <p style={{ textAlign: 'center', letterSpacing: '0.15em', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        OUR VALUES
                    </p>
                    <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--secondary)', marginBottom: '3rem' }}>
                        How we build
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        {[
                            { title: 'Simple by default', desc: 'No design skills required. If your family can use WhatsApp, they can use Nimantran Studio.' },
                            { title: 'Family first', desc: 'We build for real Indian weddings — multiple events, large guest lists, dietary requirements included.' },
                            { title: 'One fair price', desc: '₹999 one-time. No subscriptions, no watermarks, no surprises. Pay once, use it for your whole wedding season.' },
                            { title: 'Privacy matters', desc: 'Your guest data stays yours. We never sell, share, or use it for advertising.' },
                        ].map((v) => (
                            <div key={v.title} style={{ background: '#fff', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginBottom: '1rem' }} />
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>{v.title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        GET IN TOUCH
                    </p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--secondary)', marginBottom: '2.5rem' }}>
                        We'd love to hear from you
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
                        <a href="mailto:hello@nimantranstudio.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            <Mail size={18} color="var(--primary)" />
                            hello@nimantranstudio.com
                        </a>
                        <a href="tel:+918010581916" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            <Phone size={18} color="var(--primary)" />
                            +91 80105 81916
                        </a>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748B' }}>
                            <MapPin size={18} color="var(--primary)" />
                            Pune, Maharashtra, India
                        </span>
                    </div>
                    <p style={{ marginTop: '2.5rem', color: '#94A3B8', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        Made with <Heart size={14} fill="#C8A951" color="#C8A951" /> for Indian weddings
                    </p>
                </div>
            </section>

        </main>
    );
}
