import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Menu, X, ArrowRight, Crown, Sprout, Users, Globe2, Leaf,
  Heart, Award, Calendar, Clock, MapPin, Mail, Phone, Instagram, Facebook,
  Twitter, ChevronRight, Star, Quote, TrendingUp, Play,
} from "lucide-react";
import { toast } from "sonner";
import { listPublicContestants, listPublicEvents, listPublicMedia, type PublicEvent } from "@/lib/public.functions";
import { listPublicSponsors, type PublicSponsor } from "@/lib/sponsors.functions";
import { castVote, getLeaderboard, getPublicActiveCampaign } from "@/lib/voting-public.functions";
import { submitRsvp } from "@/lib/rsvp.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const heroMain = { url: "/hero-main.png" };
import aboutImg from "@/assets/about-queen.png";
const aboutVideo = "/about-video.mp4";
const queenImg = "/joy-kampamba-queen-2026.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import missAgri2025Queen from "@/assets/miss-agriculture-2025-queen.jpg.asset.json";
import logoAsset from "@/assets/miss-agriculture-zambia-logo.png";
import zanacoLogo from "@/assets/zanaco-logo.png.asset.json";
import ministryOfAgricultureLogo from "@/assets/ministry-of-agriculture.png.asset.json";
import stanbicLogo from "@/assets/stanbic-logo.png.asset.json";
import mtnZambiaLogo from "@/assets/mtn-zambia-logo.png.asset.json";
import zambiaTourismLogo from "@/assets/zambia-tourism-logo.png.asset.json";
import zambiaDevelopmentAgencyLogo from "@/assets/zambia-development-agency-logo.png.asset.json";
import unWomenLogo from "@/assets/un-women-logo.png.asset.json";
import faoZambiaLogo from "@/assets/fao-zambia-logo.png.asset.json";
import airtelZambiaLogo from "@/assets/airtel-zambia-logo.png.asset.json";

export { heroMain, g1, g2, g3, g4, g5, g6 };

// ---------- Logo ----------

function Logo({ className = "", white = false }: { className?: string; white?: boolean }) {
  return (
    <img
      src={logoAsset}
      alt="Miss Agriculture Zambia logo"
      className={`h-full w-auto object-contain transition-all duration-300 ${white ? "brightness-0 invert" : ""} ${className}`}
      width={220}
      height={88}
      loading="eager"
      decoding="async"
    />
  );
}


// ---------- Reusable bits ----------

export function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 mb-5">
      <span className="h-px w-10 bg-gold" />
      <span className="text-[11px] tracking-[0.32em] uppercase text-gold-deep font-medium">{children}</span>
      <span className="h-px w-10 bg-gold" />
    </div>
  );
}

// ---------- Header ----------

export const NAV = [
  { label: "Home", to: "/" as const },
  { label: "About", to: "/about" as const },
  { label: "Gallery", to: "/gallery" as const },
  { label: "Contestant", to: "/contestant" as const },
  { label: "Events", to: "/events" as const },
  { label: "Sponsors", to: "/sponsors" as const },
];

export function Header({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(!transparentOnTop);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!transparentOnTop) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-light text-foreground py-3" : "bg-transparent text-white py-4 md:py-5"
        }`}
      >
        <div className="container-luxe flex items-center justify-between gap-4">
          <Link
            to="/"
            preload="intent"
            aria-label="Miss Agriculture Zambia — home"
            className="flex items-center h-14 md:h-16 transition-all duration-300"
          >
            <Logo white={!scrolled} className={scrolled ? "" : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"} />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                preload="intent"
                className="text-[13px] font-medium tracking-wide relative group"
                activeProps={{ className: "text-gold-deep" }}
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link to="/contestant" preload="intent" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep text-[13px] font-semibold tracking-wide shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--gold)_55%,transparent)] hover:-translate-y-0.5 transition-all">
              Vote Now <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className={`lg:hidden p-2 rounded-full ${scrolled ? "text-foreground hover:bg-foreground/5" : "text-white hover:bg-white/10"}`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-green-deep text-ivory overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/10">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                preload="intent"
                aria-label="Miss Agriculture Zambia — home"
                className="flex items-center h-16"
              >
                <Logo white />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-full hover:bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-1 px-6 mt-6">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    preload="intent"
                    activeProps={{ className: "text-gold" }}
                    className="font-display text-3xl border-b border-white/10 py-4 block"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
              <Link to="/contestant" onClick={() => setOpen(false)} className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep font-semibold">
                Vote Now <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-8 text-xs text-ivory/60 leading-relaxed">
                Empowering Women • Advancing Agriculture • Celebrating Zambia
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// ---------- Page hero (slim for inner pages) ----------

export function PageHero({ kicker, title, italic, sub }: { kicker: string; title: string; italic?: string; sub?: string }) {
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 bg-green-deep text-ivory overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--gold) 35%, transparent), transparent 55%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--gold-deep) 25%, transparent), transparent 55%)" }} />
      <div className="container-luxe relative">
        <SectionLabel>{kicker}</SectionLabel>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          {title} {italic && <span className="italic text-gradient-gold">{italic}</span>}
        </h1>
        {sub && <p className="mt-6 max-w-2xl text-lg text-ivory/80">{sub}</p>}
      </div>
    </section>
  );
}

// ---------- Hero (home only) ----------

// ---------- Hero (home only) ----------

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section id="top" ref={ref} className="relative min-h-[88svh] md:min-h-[720px] md:h-[100dvh] overflow-hidden bg-green-forest text-white flex flex-col">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={heroMain.url} alt="Miss Agriculture Zambia" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 w-64 h-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)" }} animate={{ y: [0, -25, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden className="pointer-events-none absolute right-0 bottom-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--green-deep) 50%, transparent), transparent 70%)" }} animate={{ y: [0, 20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div style={{ opacity }} className="relative z-10 container-luxe flex-1 flex flex-col justify-center items-center text-center pt-32 md:pt-28 pb-8 md:pb-36">

        <h1 className="font-display font-medium leading-[1.02] text-[clamp(2.25rem,6.5vw,6rem)] max-w-4xl md:max-w-5xl">
          <motion.span className="block"
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            The Future of Agriculture Has a New Face.
          </motion.span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-5 md:mt-7 max-w-xl md:max-w-2xl text-base md:text-xl text-white/80 leading-relaxed font-light">
          Empowering young women to lead change, drive innovation, and shape the future of Zambia through agriculture, entrepreneurship, and leadership.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="mt-7 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
          <Link to="/contestant" className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep font-semibold text-sm tracking-wide shadow-[0_20px_50px_-15px_color-mix(in_oklab,var(--gold)_60%,transparent)] hover:shadow-[0_28px_60px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)] hover:-translate-y-0.5 transition-all w-full sm:w-auto">
            Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/sponsors" className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border border-gold/40 text-gold-soft font-medium text-sm tracking-wide hover:bg-gold/10 transition-all w-full sm:w-auto">
            Become a Sponsor
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 1 }} className="relative mx-4 mb-4 md:absolute md:left-6 md:right-6 md:bottom-6 md:mx-0 md:mb-0 z-10">
        <div className="glass rounded-2xl overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-px">
          {[
            { k: "National", v: "Platform", icon: Globe2 },
            { k: "Agricultural", v: "Innovation", icon: Sprout },
            { k: "Women", v: "Empowerment", icon: Heart },
            { k: "Cultural", v: "Promotion", icon: Star },
          ].map(({ k, v, icon: Icon }) => (
            <div key={k} className="bg-black/30 backdrop-blur-md p-3.5 md:p-5 flex items-center gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full grid place-items-center bg-gold/15 border border-gold/30">
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold" strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm md:text-lg leading-tight truncate">{k}</div>
                <div className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-gold-soft/80 truncate">{v}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}


// ---------- About teaser (home) ----------

function HomepageAboutVideo() {
  const videoId = "sej-J7vJC4k";
  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3` +
    `&fs=0&disablekb=1&showinfo=0&cc_load_policy=0`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
      <iframe
        src={src}
        title="Empowering Zambian women in agriculture"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
        style={{ border: 0, aspectRatio: "9 / 16" }}
        allow="autoplay; encrypted-media; picture-in-picture"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

export function AboutTeaser() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div aria-hidden className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%)" }} />
      <div className="container-luxe relative grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-gradient-to-br from-gold/20 to-green-deep/10 blur-2xl" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-luxe)]">
              <HomepageAboutVideo />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-deep/45 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-3 md:-right-8 bg-card rounded-2xl p-5 shadow-[var(--shadow-gold)] border border-gold/30 max-w-[240px]">
              <Award className="w-7 h-7 text-gold mb-2" strokeWidth={1.5} />
              <div className="font-display text-xl text-green-deep">Established <span className="text-gradient-gold">2023</span></div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">A national pageant with purpose for Zambia's future.</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionLabel>About the Movement</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              More than a crown.<br />
              <span className="italic text-gradient-gold">A national calling.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed">
              Established in 2023, Miss Agriculture Zambia is a groundbreaking national platform dedicated to empowering young women, promoting agricultural excellence, and showcasing Zambia's rich cultural heritage to the world.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about" preload="intent" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-green-deep text-ivory text-sm font-semibold tracking-wide hover:bg-green-forest transition-all">
                Learn About Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contestant" preload="intent" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-green-deep/25 text-green-deep text-sm font-medium hover:bg-green-deep/5 transition-all">
                Become a Contestant
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------- About ----------

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="container-luxe grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-gold/20 to-green-deep/10 blur-2xl" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-luxe)]">
              <img src={aboutImg} alt="Empowering Zambian women in agriculture" className="w-full h-full object-cover" loading="lazy" width={1280} height={1600} />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/40 to-transparent" />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="absolute -bottom-8 -right-4 md:-right-10 bg-card rounded-2xl p-6 shadow-[var(--shadow-gold)] border border-gold/30 max-w-[260px]">
              <Award className="w-8 h-8 text-gold mb-3" strokeWidth={1.5} />
              <div className="font-display text-2xl text-green-deep">Established <span className="text-gradient-gold">2023</span></div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">A national pageant with a purpose-driven mission for Zambia's future.</p>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionLabel>About the Movement</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
              More than a crown.<br />
              <span className="italic text-gradient-gold">A national calling.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              Established in 2023, Miss Agriculture Zambia is a groundbreaking national platform dedicated to empowering young women, promoting agricultural excellence, and showcasing Zambia's rich cultural heritage to the world. More than a beauty pageant, it is a movement that combines agriculture, leadership, entrepreneurship, culture, tourism, and youth empowerment. The platform provides young women with opportunities to become ambassadors for agricultural development while inspiring innovation and community transformation.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {[
                { icon: Sprout, t: "Purpose-Driven", d: "Agriculture as a vehicle for national development." },
                { icon: Crown, t: "Prestige", d: "Pageant excellence with international standards." },
                { icon: Users, t: "Community", d: "Direct impact in rural and urban communities." },
                { icon: TrendingUp, t: "Innovation", d: "Championing agribusiness and modern farming." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="p-5 rounded-2xl bg-card border border-border/60 hover:border-gold/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-green-deep/10 grid place-items-center mb-4">
                    <Icon className="w-5 h-5 text-green-deep" strokeWidth={1.6} />
                  </div>
                  <div className="font-display text-lg text-foreground">{t}</div>
                  <p className="text-sm text-muted-foreground mt-1.5">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-luxe mt-20 md:mt-28">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionLabel>Platform of Influence</SectionLabel>
            <h3 className="font-display text-3xl md:text-5xl leading-[1.05] text-foreground">
              Beauty meets purpose.<br />
              <span className="italic text-gradient-gold">Leadership meets impact.</span>
            </h3>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
            Since its inception, Miss Agriculture Zambia has become a recognized platform where beauty meets purpose and leadership meets impact. Contestants are challenged to develop innovative agricultural projects, participate in community outreach initiatives, and advocate for sustainable agricultural development.
          </p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Reveal delay={0.15}>
            <div className="p-6 rounded-2xl bg-card border border-border/60">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-deep mb-3">Parliament Tour</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One of the highlights of the programme was a special Parliament Tour, where contestants gained firsthand exposure to governance and national leadership. Participants also engaged directly with Reuben Mtolo Phiri, providing a unique opportunity to discuss the future of agriculture, youth participation, and national development.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="p-6 rounded-2xl bg-card border border-border/60">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-deep mb-3">Notable Figures</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The platform has attracted notable personalities and influential figures including Bombshell, Miss Botswana 2010/11, K Star, Haantinga Kaira, Salma Sky, Highvie H. Hamududu, Binwell Mpundu, Michie, and Harris Nation.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-luxe mt-20 md:mt-28">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionLabel>Our Vision</SectionLabel>
            <h3 className="font-display text-3xl md:text-5xl leading-[1.05] text-foreground">
              Raising a generation of <span className="italic text-gradient-gold">empowered leaders.</span>
            </h3>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">
            To raise a generation of empowered female leaders who will drive agricultural innovation, food security, entrepreneurship, cultural preservation, and sustainable economic growth across Zambia and beyond.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Story ----------

const TIMELINE = [
  { year: "2023", title: "Foundation", desc: "Miss Agriculture Zambia is founded with a mission to empower women through agriculture and national development." },
  { year: "2024", title: "Regional Auditions", desc: "Nationwide audition tour discovers extraordinary young women across all ten provinces of Zambia." },
  { year: "2025", title: "Grand Finale", desc: "Spectacular grand finale at the prestigious Quorum Hotel in Lusaka — attracting national attention and bringing together leaders, celebrities, policymakers, agricultural stakeholders, and cultural icons." },
  { year: "2025", title: "National Recognition", desc: "Government endorsements and parliament tours position the platform as a national movement." },
  { year: "2026", title: "Strategic Partnerships", desc: "Alliances with leading agribusinesses, ministries and international development partners." },
  { year: "2027", title: "Future Expansion", desc: "Regional reach across SADC and continental representation in agricultural advocacy." },
];

export function Story() {
  return (
    <section id="story" className="relative py-20 md:py-28 bg-gradient-to-b from-background to-secondary/40 overflow-hidden">
      <div className="container-luxe">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              A movement, <span className="italic text-gradient-gold">in motion.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">From a bold idea to a national platform shaping conversations around women, agriculture and identity.</p>
          </div>
        </Reveal>

        <div className="relative mt-16 max-w-4xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
          {TIMELINE.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className={`relative grid md:grid-cols-2 gap-8 mb-10 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                <div className={`pl-12 md:pl-0 ${i % 2 === 1 ? "md:pr-16 md:text-right" : "md:pl-16"} [direction:ltr]`}>
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold ring-4 ring-background animate-pulse-gold" />
                  <div className="text-gold-deep font-display text-3xl md:text-4xl">{item.year}</div>
                  <h3 className="font-display text-xl md:text-2xl mt-1 text-foreground">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                <div />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Impact ----------

const IMPACT_GROUPS = [
  { title: "Agriculture", icon: Sprout, items: ["Agricultural innovation and modernization", "Youth engagement in agribusiness", "Food security advocacy", "Sustainable farming practices"] },
  { title: "Women Empowerment", icon: Heart, items: ["Leadership development", "Entrepreneurship and skills enhancement", "Economic empowerment", "Community impact initiatives"] },
  { title: "Culture & Tourism", icon: Globe2, items: ["Promotion of Zambia's cultural heritage", "Agriculture-based tourism", "National pride and identity", "Creative and cultural showcases"] },
];

export function Impact() {
  return (
    <section id="impact" className="py-20 md:py-28 bg-green-deep text-ivory relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--gold) 40%, transparent), transparent 50%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--gold-deep) 30%, transparent), transparent 50%)" }} />
      <div className="container-luxe relative">
        <Reveal>
          <div className="max-w-3xl">
            <SectionLabel>Impact Areas</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ivory">
              Where we create <span className="italic text-gradient-gold">lasting change.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {IMPACT_GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.1}>
              <div className="group h-full p-8 rounded-3xl glass hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-br from-gold-soft to-gold-deep text-green-deep mb-6 group-hover:scale-110 transition-transform">
                  <g.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-3xl">{g.title}</h3>
                <div className="divider-gold my-6" />
                <ul className="space-y-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-ivory/85">
                      <Leaf className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="text-sm">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

// ---------- Gallery ----------

const GALLERY_SPANS = ["row-span-2", "", "", "row-span-2", "", ""];

const GALLERY_FALLBACK = [
  { id: -7, title: "Miss Agriculture 2025 Queen", url: missAgri2025Queen.url, kind: "image", category: "gallery", description: null },
  { id: -1, title: "Grand Finale", url: g2, kind: "image", category: "gallery", description: null },
  { id: -2, title: "Parliament Tour", url: g5, kind: "image", category: "gallery", description: null },
  { id: -3, title: "Cultural Showcase", url: g3, kind: "image", category: "gallery", description: null },
  { id: -4, title: "Community Project", url: g6, kind: "image", category: "gallery", description: null },
  { id: -5, title: "Agricultural Activities", url: g4, kind: "image", category: "gallery", description: null },
  { id: -6, title: "Tourism Heritage", url: g1, kind: "image", category: "gallery", description: null },
] as Array<{ id: number; title: string | null; url: string; kind: string; category: string; description: string | null }>;

export function Gallery({ showHeader = true }: { showHeader?: boolean }) {
  const fetchMedia = useServerFn(listPublicMedia);
  const q = useQuery({
    queryKey: ["public", "media"],
    queryFn: () => fetchMedia(),
    placeholderData: GALLERY_FALLBACK,
    staleTime: 60_000,
  });
  const items = q.data && q.data.length > 0 ? q.data : GALLERY_FALLBACK;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-background">
      <div className="container-luxe">
        {showHeader && (
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <SectionLabel>Featured Moments</SectionLabel>
                <h2 className="font-display text-4xl md:text-6xl max-w-2xl leading-[1.05]">
                  Moments that <span className="italic text-gradient-gold">defined a movement.</span>
                </h2>
              </div>
            </div>
          </Reveal>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[repeat(4,180px)] md:grid-rows-[repeat(2,300px)] gap-4">
            {items.map((g, i) => (
              <Reveal key={g.id} delay={i * 0.06}>
                <div className={`group relative overflow-hidden rounded-2xl h-full ${GALLERY_SPANS[i % GALLERY_SPANS.length]}`}>
                  {g.kind === "video" ? (
                    <video
                      src={g.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <img src={g.url} alt={g.title ?? "Gallery image"} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-green-deep/90 via-green-deep/20 to-transparent transition-opacity pointer-events-none ${g.kind === "video" ? "opacity-0" : "opacity-80 group-hover:opacity-100"}`} />
                  <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold-soft mb-1">Featured</div>
                    {g.title && <div className="font-display text-xl text-white">{g.title}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Personalities ----------

const PEOPLE = [
  { name: "Bombshell", role: "Performing Artist" },
  { name: "Miss Botswana 2010/11", role: "International Ambassador" },
  { name: "K Star", role: "Cultural Icon" },
  { name: "Haantinga Kaira", role: "Influencer" },
  { name: "Salma Sky", role: "Award-Winning Vocalist" },
  { name: "Highvie H. Hamududu", role: "Politician" },
  { name: "Binwell Mpundu", role: "Honourable Member" },
  { name: "Michie", role: "Model / presenter" },
  { name: "Harris Nation", role: "Creative Designer" },
];

export function Personalities() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/40 to-background overflow-hidden">
      <div className="container-luxe">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionLabel>Influential Personalities</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              Voices that <span className="italic text-gradient-gold">amplify the mission.</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <motion.div className="flex gap-6 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
            {[...PEOPLE, ...PEOPLE].map((p, i) => (
              <div key={i} className="w-[260px] shrink-0 p-6 rounded-2xl bg-card border border-border/60 hover:border-gold/50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-soft to-gold-deep grid place-items-center text-green-deep font-display text-2xl mb-4">
                  {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="font-display text-lg leading-tight">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wide">{p.role}</div>
                <div className="mt-4 flex items-center gap-1.5 text-gold">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Queen ----------

export function Queen() {
  return (
    <section id="queen" className="py-20 md:py-28 bg-green-deep text-ivory overflow-hidden relative">
      <div className="container-luxe grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal y={50}>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-gold/30 to-transparent blur-3xl" />
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-gold/30">
              <img src={queenImg} alt="Joy Kampamba — Miss Agriculture Zambia 2026" loading="lazy" className="w-full h-full object-cover" width={1280} height={1600} />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                <Crown className="w-6 h-6 text-gold" strokeWidth={1.5} />
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold-soft">Miss Agriculture Zambia 2026</div>
                  <div className="font-display text-xl">Joy Kampamba — Queen</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <SectionLabel>The Queen</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ivory">
              Grace, advocacy, <span className="italic text-gradient-gold">and harvest.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg text-ivory/80 leading-relaxed">
              The crowned queen serves as a national ambassador for agriculture, culture, and youth empowerment, representing Zambia at local and international events while championing initiatives that promote agricultural development and community transformation.
            </p>
          </Reveal>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Biography", d: "A young leader rooted in service, agriculture, and academic excellence." },
              { t: "Achievements", d: "National recognition, parliament engagements, and continental advocacy." },
              { t: "Projects", d: "School gardens, women's cooperatives and rural agribusiness initiatives." },
              { t: "Ambassadorial Roles", d: "Spokesperson for sustainable agriculture and women's economic empowerment." },
            ].map((b, i) => (
              <Reveal key={b.t} delay={0.2 + i * 0.06}>
                <div className="p-5 rounded-2xl glass hover:bg-white/10 transition-colors">
                  <div className="font-display text-lg text-gold-soft">{b.t}</div>
                  <p className="text-sm text-ivory/75 mt-1.5 leading-relaxed">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Contestants ----------


export function Contestants({
  showHeader = true,
  label = "The Contestants",
  title = (<>Meet the women <span className="italic text-gradient-gold">shaping tomorrow.</span></>),
  sub,
  scope = "active",
  emptyMessage,
  emptyCta,
}: {
  showHeader?: boolean;
  label?: string;
  title?: ReactNode;
  sub?: ReactNode;
  scope?: "active" | "past";
  emptyMessage?: ReactNode;
  emptyCta?: ReactNode;
}) {

  const [region, setRegion] = useState("All");
  const fetchContestants = useServerFn(listPublicContestants);
  const q = useQuery({
    queryKey: ["public", "contestants", scope],
    queryFn: () => fetchContestants({ data: { scope } }),
  });
  const contestants = q.data ?? [];
  const regions = ["All", ...Array.from(new Set(contestants.map((c) => c.province).filter(Boolean) as string[]))];
  const filtered = region === "All" ? contestants : contestants.filter((c) => c.province === region);

  return (
    <section id={scope === "past" ? "past-contestants" : "contestants"} className={`py-20 md:py-28 ${scope === "past" ? "bg-secondary/30" : "bg-background"}`}>
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            {showHeader ? (
              <div>
                <SectionLabel>{label}</SectionLabel>
                <h2 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
                  {title}
                </h2>
                {sub && <p className="text-muted-foreground mt-3 max-w-2xl">{sub}</p>}
              </div>
            ) : <div />}

            {contestants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <button key={r} onClick={() => setRegion(r)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                      region === r ? "bg-green-deep text-ivory" : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {q.isLoading && (
          <div className="text-center py-16 text-muted-foreground">Loading contestants...</div>
        )}
        {q.error && (
          <div className="text-center py-16 text-red-700">Could not load contestants.</div>
        )}
        {!q.isLoading && !q.error && filtered.length === 0 && (
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-border bg-card/40">
            <div className="text-muted-foreground max-w-xl mx-auto">
              {emptyMessage ?? "No contestants yet."}
            </div>
            {emptyCta && <div className="mt-6 flex justify-center">{emptyCta}</div>}
          </div>
        )}



        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-gold/50 transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]">
                <div className="aspect-[4/5] relative bg-gradient-to-br from-green-deep via-green-forest to-green-deep overflow-hidden">
                  {c.profile_photo ? (
                    <img src={c.profile_photo} alt={c.full_name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--gold) 40%, transparent), transparent 60%)" }} />
                      <div className="absolute inset-0 grid place-items-center text-gold/30 font-display text-9xl">
                        {c.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </div>
                    </>
                  )}
                  {c.province && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur text-[10px] tracking-[0.25em] uppercase text-gold-soft border border-gold/30">
                      {c.province}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-green-deep to-transparent">
                    <div className="font-display text-2xl text-ivory">{c.full_name}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Voting ----------

export function Voting() {
  const qc = useQueryClient();
  const fetchCampaign = useServerFn(getPublicActiveCampaign);
  const fetchLeaderboard = useServerFn(getLeaderboard);
  const fetchContestants = useServerFn(listPublicContestants);
  const submitVote = useServerFn(castVote);

  const campaignQ = useQuery({
    queryKey: ["public", "active-campaign"],
    queryFn: () => fetchCampaign(),
    refetchInterval: 60_000,
  });
  const boardQ = useQuery({
    queryKey: ["public", "leaderboard"],
    queryFn: () => fetchLeaderboard(),
    refetchInterval: 15_000,
  });
  const contestantsQ = useQuery({
    queryKey: ["public", "contestants", "active"],
    queryFn: () => fetchContestants({ data: { scope: "active" } }),
  });


  const [contestantId, setContestantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");

  const campaign = campaignQ.data;
  const board = boardQ.data ?? [];
  const contestants = contestantsQ.data ?? [];
  const max = Math.max(1, ...board.map((r) => r.votes));
  const pricePerVote = campaign?.price_per_vote ?? 0;
  const totalCost = quantity * pricePerVote;

  const mutate = useMutation({
    mutationFn: () => {
      if (!contestantId) throw new Error("Please select a contestant.");
      if (!Number.isFinite(quantity) || quantity < 1) throw new Error("Quantity must be at least 1.");
      return submitVote({
        data: {
          contestant_id: contestantId,
          quantity,
          voter_email: email.trim() || undefined,
        },
      });
    },
    onSuccess: (res) => {
      if (res.status === "valid") {
        toast.success(`Recorded ${res.quantity} vote${res.quantity === 1 ? "" : "s"} for ${res.contestant.full_name}.`);
      } else {
        toast.success(`Vote queued for ${res.contestant.full_name}. Awaiting payment confirmation.`);
      }
      qc.invalidateQueries({ queryKey: ["public", "leaderboard"] });
      qc.invalidateQueries({ queryKey: ["public", "contestants"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not record your vote.");
    },
  });

  const noCampaign = !campaignQ.isLoading && !campaign;

  return (
    <section id="vote" className="py-20 md:py-28 bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-luxe grid lg:grid-cols-2 gap-14">
        <Reveal>
          <div>
            <SectionLabel>Voting Platform</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              Every vote <span className="italic text-gradient-gold">writes history.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {campaign
                ? campaign.description ||
                  `Cast your vote in ${campaign.name}. Secure, verified and transparent.`
                : "Secure, verified, and transparent. Vote for your favourite contestant through our protected platform."}
            </p>

            {noCampaign ? (
              <div className="mt-8 p-6 rounded-2xl border border-dashed border-border bg-card/60 text-sm text-muted-foreground">
                Voting is currently closed. Please check back when the next campaign opens.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate.mutate();
                }}
                className="mt-8 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    Contestant
                  </label>
                  <select
                    value={contestantId ?? ""}
                    onChange={(e) => setContestantId(e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    required
                  >
                    <option value="">Select a contestant...</option>
                    {contestants.map((c, i) => (
                      <option key={c.id} value={c.id}>
                        #{String(i + 1).padStart(2, "0")} — {c.full_name}
                        {c.province ? ` (${c.province})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm tabular-nums"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      maxLength={200}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Total cost
                  </span>
                  <span className="font-display text-xl tabular-nums">
                    {pricePerVote > 0
                      ? `ZMW ${totalCost.toFixed(2)}`
                      : "Free"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={mutate.isPending || !contestantId}
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-green-deep text-ivory font-semibold text-sm tracking-wide hover:bg-green-forest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutate.isPending ? "Recording..." : "Cast Your Vote"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="p-8 rounded-3xl bg-card border border-border/60 shadow-[var(--shadow-luxe)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold-deep">Live Ranking Board</div>
                <h3 className="font-display text-2xl mt-1">Top Contestants</h3>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {boardQ.isLoading && (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading leaderboard...</div>
            )}
            {!boardQ.isLoading && board.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">No votes recorded yet.</div>
            )}

            <div className="space-y-5">
              {board.map((r, i) => (
                <div key={r.id}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg text-gold-deep w-6">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-medium text-foreground">{r.full_name}</span>
                      {r.province && (
                        <span className="text-xs text-muted-foreground">• {r.province}</span>
                      )}
                    </div>
                    <span className="tabular-nums font-semibold">{r.votes.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(r.votes / max) * 100}%` }}
                      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Events ----------

function getEventDateParts(iso: string | null) {
  if (!iso) return { day: "--", month: "TBA", year: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: "--", month: "TBA", year: "" };
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
  };
}

function formatEventTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  audition: "Auditions",
  workshop: "Workshop",
  community_outreach: "Outreach",
  grand_finale: "Pageant",
  sponsorship: "Sponsorship",
  agricultural_exhibition: "Summit",
};

export function Events({ showHeader = true }: { showHeader?: boolean }) {
  const fetchEvents = useServerFn(listPublicEvents);
  const q = useQuery({
    queryKey: ["public", "events"],
    queryFn: () => fetchEvents(),
  });
  const events = q.data ?? [];
  const [registerFor, setRegisterFor] = useState<PublicEvent | null>(null);

  return (
    <section id="events" className="py-20 md:py-28 bg-background">
      <div className="container-luxe">
        {showHeader && (
          <Reveal>
            <div className="max-w-3xl mb-12">
              <SectionLabel>Events Calendar</SectionLabel>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
                The journey, <span className="italic text-gradient-gold">date by date.</span>
              </h2>
            </div>
          </Reveal>
        )}

        {q.isLoading && (
          <div className="text-center py-16 text-muted-foreground">Loading events...</div>
        )}
        {q.error && (
          <div className="text-center py-16 text-red-700">Could not load events.</div>
        )}
        {!q.isLoading && !q.error && events.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No events scheduled yet.</div>
        )}

        <div className="grid gap-5">
          {events.map((e, i) => {
            const dateParts = getEventDateParts(e.starts_at);
            const timeStr = formatEventTime(e.starts_at);
            return (
              <Reveal key={e.id} delay={i * 0.06}>
                <div className="group relative flex flex-col md:flex-row gap-0 rounded-xl bg-card border border-border overflow-hidden hover:border-gold/30 hover:shadow-[var(--shadow-gold)] transition-all duration-300">
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-deep opacity-80" />

                  {/* Date column */}
                  <div className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-1 px-6 py-5 md:py-7 md:w-36 md:shrink-0 border-b md:border-b-0 md:border-r border-border/60 bg-muted/30">
                    <div className="flex flex-col items-center md:items-start">
                      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-deep">{dateParts.month}</span>
                      <span className="font-display text-4xl md:text-5xl leading-none text-foreground">{dateParts.day}</span>
                      <span className="text-xs tracking-wider text-muted-foreground mt-0.5">{dateParts.year}</span>
                    </div>
                    {timeStr && (
                      <div className="md:mt-2 flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-gold-deep" strokeWidth={1.8} />
                        <span className="text-xs font-medium tracking-wide">{timeStr}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 px-6 py-5 md:py-7 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-deep" />
                      <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium">{EVENT_TYPE_LABEL[e.type] ?? e.type}</span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl text-foreground leading-tight">{e.title}</h3>
                    {e.location && (
                      <div className="mt-2 flex flex-col gap-1">
                        {e.location.split(" | ").map((loc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-gold-deep/60" />
                            <span>{loc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-start md:justify-center px-6 pb-5 md:pb-0 md:pr-7 md:pl-0">
                    <button
                      onClick={() => setRegisterFor(e)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-foreground text-ivory font-medium text-sm hover:bg-green-deep transition-colors duration-200"
                    >
                      Register <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <RegisterDialog event={registerFor} onOpenChange={(open) => { if (!open) setRegisterFor(null); }} />
    </section>
  );
}

function RegisterDialog({
  event,
  onOpenChange,
}: {
  event: PublicEvent | null;
  onOpenChange: (open: boolean) => void;
}) {
  const submit = useServerFn(submitRsvp);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", industry: "", company: "" });
  const mutation = useMutation({
    mutationFn: (data: { event_id: number; full_name: string; email: string; phone: string; industry: string; company: string }) =>
      submit({ data }),
    onSuccess: () => {
      toast.success("Registration confirmed! We'll be in touch.");
      setForm({ full_name: "", email: "", phone: "", industry: "", company: "" });
      onOpenChange(false);
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Could not submit. Please try again.");
    },
  });

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Register for {event?.title}</DialogTitle>
          <DialogDescription>
            {event?.location ? `${event.location} · ` : ""}
            {event ? getEventDateParts(event.starts_at).day : ""}{" "}
            {event ? getEventDateParts(event.starts_at).month : ""}{" "}
            {event ? getEventDateParts(event.starts_at).year : ""}
            {event && formatEventTime(event.starts_at) ? ` · ${formatEventTime(event.starts_at)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!event) return;
            if (form.full_name.trim().length < 2) {
              toast.error("Please enter your full name.");
              return;
            }
            mutation.mutate({ event_id: event.id, ...form });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="rsvp-name">Full name</Label>
            <Input id="rsvp-name" required value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rsvp-email">Email</Label>
            <Input id="rsvp-email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rsvp-phone">Phone</Label>
            <Input id="rsvp-phone" type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-industry">Industry <span className="text-xs text-foreground/50">(optional)</span></Label>
              <Input id="rsvp-industry" placeholder="e.g. Agriculture" value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-company">Company <span className="text-xs text-foreground/50">(optional)</span></Label>
              <Input id="rsvp-company" placeholder="Company name" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}
              className="bg-foreground text-ivory hover:bg-green-deep">
              {mutation.isPending ? "Submitting..." : "Confirm registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Sponsors ----------

type Sponsor = { name: string; domain?: string; logo?: string; href?: string; noLogo?: boolean };

const SPONSORS: Sponsor[] = [
  { name: "Zambia National Commercial Bank", domain: "zanaco.co.zm", href: "https://www.zanaco.co.zm", logo: zanacoLogo.url },
  { name: "Ministry of Agriculture", domain: "agriculture.gov.zm", href: "https://www.agriculture.gov.zm", logo: ministryOfAgricultureLogo.url },
  { name: "Stanbic Bank Zambia", domain: "stanbicbank.co.zm", href: "https://www.stanbicbank.co.zm", logo: stanbicLogo.url },
  { name: "MTN Zambia", domain: "mtn.zm", href: "https://www.mtn.zm", logo: mtnZambiaLogo.url },
  { name: "Airtel Zambia", domain: "airtel.co.zm", href: "https://www.airtel.co.zm", logo: airtelZambiaLogo.url },
  { name: "Zambia Tourism Agency", domain: "zambia.travel", href: "https://www.zambia.travel", logo: zambiaTourismLogo.url },
  { name: "UN Women", domain: "unwomen.org", href: "https://www.unwomen.org", logo: unWomenLogo.url },
  { name: "FAO Zambia", domain: "fao.org", href: "https://www.fao.org/zambia", logo: faoZambiaLogo.url },
  { name: "Zambia Development Agency", domain: "zda.org.zm", href: "https://www.zda.org.zm", logo: zambiaDevelopmentAgencyLogo.url },
];


function SponsorCard({ s }: { s: Sponsor }) {
  // Clearbit's free Logo API was shut down. Try unavatar (aggregates several
  // providers) then Google's favicon service, then fall back to text.
  const sources = s.noLogo
    ? []
    : [
        s.logo,
        s.domain ? `https://unavatar.io/${s.domain}?fallback=false` : undefined,
        s.domain ? `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128` : undefined,
      ].filter(Boolean) as string[];

  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  const inner = (
    <div className="aspect-square rounded-2xl bg-white border border-border/60 grid place-items-center text-center p-6 md:p-8 hover:border-gold/60 hover:shadow-md transition-all">
      {src ? (
        <img
          src={src}
          alt={`${s.name} logo`}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
          className="max-h-32 md:max-h-40 max-w-full object-contain"
        />
      ) : (
        <span className="font-display text-base md:text-lg text-foreground/80">{s.name}</span>
      )}
    </div>

  );
  return s.href ? (
    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
      {inner}
    </a>
  ) : (
    <div title={s.name}>{inner}</div>
  );
}

export function Sponsors({ showHeader = true }: { showHeader?: boolean }) {
  const fn = useServerFn(listPublicSponsors);
  const { data } = useQuery({
    queryKey: ["public", "sponsors"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });

  const items: Sponsor[] = (data ?? []).map((s: PublicSponsor) => ({
    name: s.name,
    logo: s.logo_url ?? undefined,
    href: s.website ?? undefined,
    noLogo: !s.logo_url,
  }));

  return (
    <section id="sponsors" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/40">
      <div className="container-luxe">
        {showHeader && (
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <SectionLabel>Sponsors & Partners</SectionLabel>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
                Powered by partners who <span className="italic text-gradient-gold">believe.</span>
              </h2>
            </div>
          </Reveal>
        )}

        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No sponsors yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {items.map((s) => (
              <SponsorCard key={s.name} s={s} />
            ))}
          </div>
        )}


      </div>
    </section>
  );
}

// ---------- Testimonials ----------

const TESTIMONIALS = [
  { quote: "Miss Agriculture Zambia is more than a pageant — it's a national engine for change, opportunity and inspiration.", author: "Hon. Minister of Agriculture", role: "Government of Zambia" },
  { quote: "The platform has redefined how we celebrate young women — by tying beauty to purpose, and purpose to harvest.", author: "Salma Sky", role: "Award-Winning Artist" },
  { quote: "I returned to my village with skills, contacts and confidence. The pageant changed my life and my family's future.", author: "Former Contestant", role: "Class of 2025" },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-green-deep text-ivory">
      <div className="container-luxe">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ivory">
              In their <span className="italic text-gradient-gold">own words.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="h-full p-8 rounded-3xl glass hover:bg-white/10 transition-colors">
                <Quote className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
                <p className="text-lg leading-relaxed text-ivory/90 font-light italic">"{t.quote}"</p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="font-display text-lg">{t.author}</div>
                  <div className="text-xs tracking-wider uppercase text-gold-soft mt-1">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- News ----------

const NEWS = [
  { tag: "Press", title: "Miss Agriculture Zambia Tours National Parliament", date: "Jun 12, 2026", img: g5 },
  { tag: "Community", title: "Queen Launches School Garden Initiative in Eastern Province", date: "May 28, 2026", img: g6 },
  { tag: "Culture", title: "National Cultural Showcase Headlines at Lusaka Gala", date: "Apr 19, 2026", img: g3 },
];

export function News() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <SectionLabel>News & Media</SectionLabel>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-2xl">
                Latest from the <span className="italic text-gradient-gold">movement.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {NEWS.map((n, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <article className="group rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-gold/40 hover:-translate-y-1 transition-all">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={n.img} alt={n.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-gold-deep">
                    {n.tag} <span className="w-1 h-1 rounded-full bg-border" /> <span className="text-muted-foreground">{n.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug group-hover:text-green-deep transition-colors">{n.title}</h3>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-green-deep">
                    Read story <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA ----------

export function CTA() {
  return (
    <section id="register" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-ivory to-[oklch(0.96_0.02_85)] text-green-deep">
      <div aria-hidden className="absolute inset-0 opacity-[0.06]">
        <img src={g1} alt="" className="w-full h-full object-cover" />
      </div>
      <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)" }} />
      <div className="container-luxe relative text-center max-w-4xl mx-auto">
        <Reveal><SectionLabel>Join the Movement</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-5xl md:text-7xl leading-[1.02]">
            The future of Zambia is being <span className="italic text-gradient-gold">written today.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 text-lg md:text-xl text-green-deep/75 max-w-2xl mx-auto">
            Miss Agriculture Zambia is creating a future where agriculture is celebrated, women are empowered, culture is preserved, and communities thrive. Together, we are cultivating leaders, inspiring innovation, and building a stronger Zambia through agriculture.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/sponsors" className="px-7 py-4 rounded-full bg-green-deep text-ivory font-medium text-sm hover:bg-green-forest transition-colors">Sponsor</Link>
            <Link to="/events" className="px-7 py-4 rounded-full border border-green-deep/30 text-green-deep font-medium text-sm hover:bg-green-deep/5 transition-colors">Events</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Footer ----------

export function Footer() {
  return (
    <footer className="bg-[oklch(0.1_0.02_152)] text-ivory/80 pt-16 pb-10">
      <div className="container-luxe grid lg:grid-cols-12 gap-12 mb-12">
        <div className="lg:col-span-4">
          <Link to="/" preload="intent" className="inline-flex items-center h-16 mb-5 hover:opacity-90 transition-opacity">
            <Logo white />
          </Link>
          <p className="text-sm leading-relaxed text-ivory/65 max-w-sm">Empowering Women • Advancing Agriculture • Celebrating Zambia. A national movement for women, agriculture, and youth empowerment.</p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.instagram.com/miss_agriculturezambia_?igsh=ZnZtM2lkcW5nN2Fp&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-full border border-white/10 hover:border-gold/40 hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a href="https://www.facebook.com/share/1HkvV1wMRC/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-full border border-white/10 hover:border-gold/40 hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-display text-base text-ivory mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-gold transition-colors">{n.label}</Link></li>)}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-display text-base text-ivory mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-gold" /> LSSP 95 B, Chipata, Eastern Province, Zambia</li>
            <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 text-gold" /> info@missagriculturezambia.com</li>
            <li className="flex items-start gap-3"><Phone className="w-4 h-4 mt-0.5 text-gold" /> <span>+260 963 001 083<br />+260 973 470 303</span></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-display text-base text-ivory mb-4">Newsletter</h4>
          <p className="text-sm text-ivory/65 mb-4">Receive updates on auditions, finales and impact stories.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed. Welcome to the movement."); (e.currentTarget as HTMLFormElement).reset(); }} className="flex">
            <input type="email" required placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-l-full bg-white/5 border border-white/10 border-r-0 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold/50" />
            <button className="px-5 rounded-r-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep" aria-label="Subscribe">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="container-luxe border-t border-white/10 pt-8 text-center text-xs text-ivory/50">
        <div>© {new Date().getFullYear()} Miss Agriculture Zambia. All rights reserved.</div>
      </div>
    </footer>
  );
}
