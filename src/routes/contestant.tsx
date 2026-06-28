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
