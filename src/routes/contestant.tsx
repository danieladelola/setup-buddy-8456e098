import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageHero, Contestants, Personalities, Footer } from "@/components/site";


export const Route = createFileRoute("/contestant")({
  head: () => ({
    meta: [
      { title: "Contestants — Miss Agriculture Zambia 2027" },
      { name: "description", content: "Meet the Miss Agriculture Zambia 2027 contestants, view live voting and discover the personalities shaping the next edition." },
      { property: "og:title", content: "Contestants — Miss Agriculture Zambia 2027" },
      { property: "og:description", content: "Meet the women shaping tomorrow at Miss Agriculture Zambia 2027. Vote, follow, and support." },
    ],
  }),
  component: ContestantPage,
});

function ContestantPage() {
  return (
    <main className="bg-background text-foreground">
      <PageHero kicker="Contestant" title="Meet the women" italic="shaping tomorrow." sub="Browse contestant profiles and apply to join the Miss Agriculture Zambia 2027 stage." />

      <section className="bg-green-deep text-ivory pb-12 md:pb-16 -mt-4 md:-mt-6">
        <div className="container-luxe">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-deep">Applications open · Miss Agriculture Zambia 2027</p>
              <h2 className="font-display text-2xl md:text-3xl mt-1">Want to be on the Miss Agriculture Zambia 2027 stage?</h2>
              <p className="text-ivory/75 text-sm mt-2 max-w-xl">
                Submit your application, pay the ZMW 200 fee and join the Miss Agriculture Zambia 2027 class of contestants.
              </p>
            </div>
            <Link
              to="/contestant-apply"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep font-semibold text-sm tracking-wide shadow-[0_20px_50px_-15px_color-mix(in_oklab,var(--gold)_60%,transparent)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Become a Contestant
            </Link>
          </div>
        </div>
      </section>

      <Contestants
        scope="active"
        label="Active Contestants · 2027"
        title={<>The women on the <span className="italic text-gradient-gold">2027 stage.</span></>}
        sub="The official Miss Agriculture Zambia 2027 contestants — open for voting below."
        emptyMessage={
          <>
            The 2027 contestant roster is being finalised. Applications are still open — secure your place on the official lineup.
          </>
        }
        emptyCta={
          <Link
            to="/contestant-apply"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-deep text-ivory text-sm font-semibold tracking-wide hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Apply to be a Contestant
          </Link>
        }
      />
      
      <Contestants
        scope="past"
        label="Past Contestants"
        title={<>Miss Agriculture Zambia <span className="italic text-gradient-gold">2026.</span></>}
        sub="A salute to the 2026 class — the women who carried the sash before the 2027 stage opens."
      />

      <Personalities />
      <Footer />

    </main>
  );
}
