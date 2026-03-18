"use client";
import { Reveal } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { useInView } from "@/lib/useInView";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, isInView } = useInView(0.3);

  return (
    <motion.span
      ref={ref}
      className="font-display font-extrabold text-4xl md:text-5xl text-brand-blue"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}{suffix}
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
}

const STATS = [
  { value: 164, suffix: "", label: "Days of rain per year in Portland" },
  { value: 37, suffix: "\"", label: "Average annual rainfall" },
  { value: 90, suffix: "%", label: "Of buildings develop algae within 2 years" },
];

export function WhyClean() {
  return (
    <section className="relative py-24 md:py-32 bg-dark-section text-white overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[50px] md:h-[72px]" fill="none">
          <path fill="#FFFFFF" d="M0,56 C180,20 360,72 540,48 C720,24 900,64 1080,44 C1260,24 1380,56 1440,40 L1440,72 L0,72 Z" />
        </svg>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] right-[10%] w-2 h-2 rounded-full bg-brand-blue/20 animate-float" />
        <div className="absolute top-[40%] left-[5%] w-3 h-3 rounded-full bg-brand-blue/15 animate-float-slow" />
        <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 rounded-full bg-brand-mint/20 animate-float-slower" />
      </div>

      <div className="container-site relative z-10 pt-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <Reveal>
              <span className="overline mb-4 block">The Portland Problem</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display font-extrabold text-display-lg text-white mb-6">
                Portland Weather Doesn&apos;t Take Days Off.
                <br />
                <span className="text-brand-blue">Neither Should Your Cleaning.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                Nine months of drizzle. Moss on every north-facing wall. Green algae creeping across your parking lot. That signature Pacific Northwest &ldquo;patina&rdquo; isn&apos;t charming — it&apos;s deteriorating your surfaces and driving away customers.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Regular exterior maintenance isn&apos;t cosmetic. It protects your investment, extends surface life, and tells every person who walks by that you give a damn about your property.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <a href="#contact" className="btn-primary group">
                Get a Free Property Assessment
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Right: Stats */}
          <div className="space-y-8">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 * i}>
                <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-white/60 text-base leading-relaxed pt-2">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[50px] md:h-[72px]" fill="none">
          <path fill="#FFFFFF" d="M0,56 C180,20 360,72 540,48 C720,24 900,64 1080,44 C1260,24 1380,56 1440,40 L1440,72 L0,72 Z" />
        </svg>
      </div>
    </section>
  );
}
