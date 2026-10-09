"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Feather,
  Heart,
  HeartHandshake,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const commitments = [
  {
    icon: ShieldCheck,
    title: "Unwavering transparency",
    text: "Complete openness, with no blurred lines or unspoken baggage left to surprise you.",
  },
  {
    icon: HeartHandshake,
    title: "Clear boundaries",
    text: "I will not let outside distractions or past ties compromise the care we share.",
  },
  {
    icon: RefreshCw,
    title: "Consistent rebuilding",
    text: "Patience, reassurance, and steady actions that speak louder than any promise.",
  },
];

const reflections = [
  {
    title: "The quiet in-between moments",
    text: "The unplanned conversations, comfortable silences, and tiny check-ins are the parts I hold closest. They made being known feel easy.",
  },
  {
    title: "The laughter that is only ours",
    text: "Our shared language, the ridiculous laughs, and the way we find light in ordinary days are not replaceable. I should have protected that more carefully.",
  },
  {
    title: "What I understand now",
    text: "A bond like ours deserves clarity, not complications. I am choosing to let my actions reflect what I have always valued: what is real between us.",
  },
];

type ModalKind = "talk" | "space" | null;

export default function Home() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [modal, setModal] = useState<ModalKind>(null);
  const [openReflection, setOpenReflection] = useState<number | null>(0);
  const [selectedPromises, setSelectedPromises] = useState<number[]>([]);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const audioTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) window.clearInterval(audioTimerRef.current);
      oscillatorsRef.current.forEach((oscillator) => oscillator.stop());
      void audioRef.current?.close();
    };
  }, []);

  const toggleAudio = () => {
    if (audioOn) {
      if (audioTimerRef.current) window.clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
      oscillatorsRef.current.forEach((oscillator) => oscillator.stop());
      oscillatorsRef.current = [];
      setAudioOn(false);
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const context = audioRef.current ?? new AudioContextClass();
    audioRef.current = context;
    const master = context.createGain();
    master.gain.value = 0.028;
    master.connect(context.destination);

    // Original ambient harmony; no external recording or copyrighted melody is used.
    [174.61, 261.63, 329.63].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 3 - 3;
      const voice = context.createGain();
      voice.gain.value = index === 0 ? 0.5 : 0.22;
      oscillator.connect(voice);
      voice.connect(master);
      oscillator.start();
      oscillatorsRef.current.push(oscillator);
    });

    const notes = [523.25, 659.25, 783.99, 659.25];
    let noteIndex = 0;
    const playNote = () => {
      const note = context.createOscillator();
      const envelope = context.createGain();
      const now = context.currentTime;
      note.type = "sine";
      note.frequency.value = notes[noteIndex % notes.length];
      envelope.gain.setValueAtTime(0.0001, now);
      envelope.gain.exponentialRampToValueAtTime(0.055, now + 0.12);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      note.connect(envelope);
      envelope.connect(master);
      note.start(now);
      note.stop(now + 3);
      noteIndex += 1;
    };

    playNote();
    audioTimerRef.current = window.setInterval(playNote, 3600);
    setAudioOn(true);
  };

  const togglePromise = (index: number) => {
    setSelectedPromises((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  return (
    <main className="overflow-hidden">
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 origin-left bg-wasabi-600"
        style={{ scaleX: progress }}
      />

      <nav className="fixed top-1 z-40 flex w-full items-center justify-between border-b border-wasabi-100/60 bg-[#fdfefc]/80 px-5 py-4 backdrop-blur-md sm:px-8">
        <a href="#arrival" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-wasabi-800">
          <span className="grid size-8 place-items-center rounded-full bg-wasabi-100 text-wasabi-700">
            <Feather size={15} />
          </span>
          A space to rebuild
        </a>
        <div className="hidden items-center gap-6 text-xs font-medium text-slate-500 sm:flex">
          <a href="#accountability" className="transition hover:text-wasabi-700">The apology</a>
          <a href="#bond" className="transition hover:text-wasabi-700">Our bond</a>
          <a href="#commitments" className="transition hover:text-wasabi-700">Moving forward</a>
        </div>
      </nav>

      <button
        type="button"
        onClick={toggleAudio}
        aria-label={audioOn ? "Turn ambient sound off" : "Turn ambient sound on"}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-wasabi-200 bg-white/90 px-3 py-2 text-xs font-medium text-wasabi-800 shadow-sm backdrop-blur-md transition hover:border-wasabi-400"
      >
        {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span className="hidden sm:inline">{audioOn ? "Ambient on" : "Ambient sound"}</span>
      </button>

      <section id="arrival" className="relative flex min-h-[92vh] items-center px-5 pb-20 pt-36 sm:px-8 lg:px-16">
        <div className="absolute -left-24 top-40 size-80 rounded-full bg-wasabi-100/70 blur-3xl" />
        <div className="absolute -right-20 top-24 size-96 rounded-full bg-[#e5ebe0] blur-3xl" />
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 2, -1, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] top-44 text-wasabi-400/60"
        >
          <Feather size={38} strokeWidth={1} />
        </motion.div>
        <div className="relative mx-auto w-full max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-wasabi-700">
              <span className="h-px w-10 bg-wasabi-500" /> A sincere note
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.08] tracking-[-0.035em] text-slate-800 sm:text-7xl lg:text-8xl">
              To you: what&apos;s on my heart <em className="font-normal text-wasabi-600">& why I&apos;m sorry.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-500">
              A space built to speak honestly, take complete accountability, and say what matters most.
            </p>
            <a href="#accountability" className="mt-10 inline-flex items-center gap-3 rounded-full bg-wasabi-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-wasabi-700/15 transition hover:bg-wasabi-800">
              Read the letter <ArrowDown size={16} />
            </a>
          </motion.div>
          <div className="mt-24 grid grid-cols-2 gap-8 border-t border-wasabi-200/70 pt-6 text-xs uppercase tracking-[0.17em] text-slate-400 sm:grid-cols-4">
            <span>01 / Accountability</span><span>02 / Reflection</span><span>03 / Commitments</span><span>04 / An open door</span>
          </div>
        </div>
      </section>

      <section id="accountability" className="bg-wasabi-50/70 px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="01" label="The apology" />
          <div className="mt-12 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <h2 className="font-display text-4xl leading-tight text-slate-800 sm:text-5xl">I am sorry for the peace I disrupted.</h2>
              <p className="mt-6 leading-7 text-slate-500">Not to be forgiven quickly. Not to make the discomfort disappear. Just to tell you the truth without asking you to carry any of it for me.</p>
              <div className="mt-8 h-px w-20 bg-wasabi-500" />
            </div>
            <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-wasabi-200/70 bg-white/80 p-7 shadow-soft backdrop-blur-md sm:p-12">
              <div className="mb-10 flex items-center justify-between text-wasabi-600"><Feather size={22} /><span className="font-display text-sm italic text-slate-400">An open letter</span><Heart size={18} fill="currentColor" /></div>
              <div className="space-y-5 text-[1.05rem] leading-8 text-slate-600">
                <p>There is no version of this that deserves an excuse. Bringing past complications and someone else into the picture fractured the safety of what we had. It created hurt, confusion, and a distance I never wanted between us.</p>
                <p>I can see how my choices made you question your place, my intentions, and whether our bond was being treated with the care it deserved. You did not deserve mixed signals or to feel like you had to compete with a history that should have been handled honestly and separately.</p>
                <p>I am taking responsibility for all of it. I am sorry for the pain I caused, for the peace I broke, and for the ways my actions failed to match how much you mean to me. I understand that trust is not repaired by a beautiful paragraph. It is earned slowly, through clarity and consistency.</p>
                <p className="font-display text-2xl italic text-wasabi-700">I am listening. I am learning. And I will respect your pace.</p>
              </div>
            </motion.article>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {["No excuses or deflections—just honesty.", "Acknowledging the pain and confusion caused.", "Respecting your feelings and your pace."].map((quote, index) => (
              <motion.div key={quote} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border-l-2 border-wasabi-400 px-5 py-3">
                <Sparkles size={16} className="mb-4 text-wasabi-600" /><p className="font-display text-xl leading-snug text-slate-700">{quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="bond" className="px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="02" label="The reflection" />
          <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <h2 className="font-display text-4xl leading-tight text-slate-800 sm:text-5xl">What our bond truly means to me.</h2>
              <p className="mt-6 leading-7 text-slate-500">Some connections make the ordinary feel like enough. Ours has always been one of them—and I never want my mistake to rewrite its worth.</p>
            </div>
            <div className="space-y-3">
              {reflections.map((reflection, index) => {
                const isOpen = openReflection === index;
                return (
                  <div key={reflection.title} className={`overflow-hidden rounded-2xl border transition ${isOpen ? "border-wasabi-300 bg-wasabi-50/70" : "border-slate-200 bg-white"}`}>
                    <button type="button" onClick={() => setOpenReflection(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6">
                      <span className="flex items-center gap-4"><span className="font-mono text-xs text-wasabi-600">0{index + 1}</span><span className="font-semibold text-slate-700">{reflection.title}</span></span>
                      <ChevronDown size={18} className={`shrink-0 text-wasabi-600 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-14 pb-6 text-sm leading-7 text-slate-500"><p>{reflection.text}</p></motion.div>}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="commitments" className="bg-[#f3f6f0] px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="03" label="Moving forward" />
          <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-4xl leading-tight text-slate-800 sm:text-5xl">Trust is built in the small, repeated choices.</h2>
            <p className="max-w-xs text-sm leading-6 text-slate-500">Tap each promise as a reminder of what I am committing to practice—not just say.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {commitments.map((commitment, index) => {
              const Icon = commitment.icon;
              const selected = selectedPromises.includes(index);
              return (
                <motion.button key={commitment.title} type="button" whileTap={{ scale: 0.98 }} onClick={() => togglePromise(index)} className={`group rounded-3xl border p-7 text-left transition ${selected ? "border-wasabi-500 bg-wasabi-700 text-white shadow-lg shadow-wasabi-700/15" : "border-wasabi-200 bg-white/75 text-slate-700 hover:-translate-y-1 hover:border-wasabi-400"}`}>
                  <div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-2xl ${selected ? "bg-white/15 text-wasabi-100" : "bg-wasabi-100 text-wasabi-700"}`}><Icon size={20} /></span><span className={`grid size-7 place-items-center rounded-full border ${selected ? "border-white/30 bg-white/15" : "border-slate-200"}`}>{selected && <Check size={15} />}</span></div>
                  <h3 className="mt-10 font-display text-2xl">{commitment.title}</h3><p className={`mt-3 text-sm leading-6 ${selected ? "text-wasabi-50" : "text-slate-500"}`}>{commitment.text}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-door" className="px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel number="04" label="The open door" centered />
          <h2 className="mt-12 font-display text-4xl leading-tight text-slate-800 sm:text-6xl">There is no pressure to answer today.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">Whatever you need from here, I want to meet it with respect. Your feelings are not a deadline.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => setModal("talk")} className="inline-flex items-center justify-center gap-2 rounded-full bg-wasabi-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-wasabi-800">I&apos;m ready to talk when you are <MessageCircle size={16} /></button>
            <button onClick={() => setModal("space")} className="inline-flex items-center justify-center gap-2 rounded-full border border-wasabi-300 bg-white px-6 py-3.5 text-sm font-semibold text-wasabi-800 transition hover:bg-wasabi-50">I need space & time right now <ArrowRight size={16} /></button>
          </div>
          <div className="mx-auto mt-24 flex max-w-sm items-center justify-center gap-3 border-t border-wasabi-200 pt-8 text-sm text-slate-400"><Heart size={15} className="text-wasabi-600" fill="currentColor" /> With care, always <Heart size={15} className="text-wasabi-600" fill="currentColor" /></div>
        </div>
      </section>

      <AnimatePresence>
        {modal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-900/20 p-5 backdrop-blur-sm" onClick={() => setModal(null)}>
          <motion.div initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-3xl border border-wasabi-200 bg-[#fdfefc] p-8 text-center shadow-2xl">
            <button type="button" onClick={() => setModal(null)} aria-label="Close dialog" className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-wasabi-100 text-wasabi-700">{modal === "talk" ? <MessageCircle /> : <Feather />}</span>
            <h2 className="mt-6 font-display text-3xl text-slate-800">{modal === "talk" ? "I&apos;ll be here." : "I hear you."}</h2>
            <p className="mt-4 leading-7 text-slate-500">{modal === "talk" ? "Take all the time you need. When you are ready, I am here to listen—not to defend, but to understand." : "I completely respect that. My door and heart stay open with no rush, no expectations, and no more asking you to carry this."}</p>
            <button type="button" onClick={() => setModal(null)} className="mt-7 rounded-full bg-wasabi-700 px-6 py-3 text-sm font-semibold text-white">I understand</button>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}

function SectionLabel({ number, label, centered = false }: { number: string; label: string; centered?: boolean }) {
  return <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-wasabi-700 ${centered ? "justify-center" : ""}`}><span>{number}</span><span className="h-px w-8 bg-wasabi-500" /><span>{label}</span></p>;
}
