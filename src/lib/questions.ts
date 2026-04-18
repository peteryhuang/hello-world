import type { Question } from '@/types/game';

export const SEED_QUESTIONS: Omit<Question, 'createdAt'>[] = [
  // Tier 1 — Light & Fun
  { id: 'q01', tier: 1, active: true, text: "What's a small thing that made you smile this week?" },
  { id: 'q02', tier: 1, active: true, text: "What's your go-to comfort food?" },
  { id: 'q03', tier: 1, active: true, text: "If you could have any skill instantly, what would it be?" },
  { id: 'q04', tier: 1, active: true, text: "What's a hobby you've had for a long time?" },
  { id: 'q05', tier: 1, active: true, text: "What's a book, movie, or show you'd recommend — and why?" },
  { id: 'q06', tier: 1, active: true, text: "What's something you learned recently that surprised you?" },
  { id: 'q07', tier: 1, active: true, text: "What does your ideal weekend look like?" },
  { id: 'q08', tier: 1, active: true, text: "What's a song that always lifts your mood?" },
  { id: 'q09', tier: 1, active: true, text: "What's something you're weirdly good at?" },
  { id: 'q10', tier: 1, active: true, text: "If you could travel anywhere tomorrow, where would it be?" },
  { id: 'q11', tier: 1, active: true, text: "What's a tradition you love?" },
  { id: 'q12', tier: 1, active: true, text: "What's something you collect or used to collect?" },
  { id: 'q13', tier: 1, active: true, text: "What's your favorite way to spend time outdoors?" },
  { id: 'q14', tier: 1, active: true, text: "What's something that makes you laugh every time?" },
  { id: 'q15', tier: 1, active: true, text: "What's your favorite time of day and why?" },
  { id: 'q16', tier: 1, active: true, text: "What's a pet peeve that's actually kind of funny?" },
  { id: 'q17', tier: 1, active: true, text: "What's something you're proud of that others might not know about?" },
  { id: 'q18', tier: 1, active: true, text: "What's a meal someone made for you that you still remember?" },
  { id: 'q19', tier: 1, active: true, text: "What's your go-to way to relax after a stressful day?" },
  { id: 'q20', tier: 1, active: true, text: "What's something you've always wanted to try?" },
  { id: 'q21', tier: 1, active: true, text: "What's a childhood memory that still makes you happy?" },
  { id: 'q22', tier: 1, active: true, text: "What's your favorite thing about where you live?" },
  { id: 'q23', tier: 1, active: true, text: "What's your favorite way to move your body?" },
  { id: 'q24', tier: 1, active: true, text: "What are you currently curious about?" },
  { id: 'q25', tier: 1, active: true, text: "What's a goal you've already achieved that you're proud of?" },
  { id: 'q26', tier: 1, active: true, text: "What's something you do that helps you think more clearly?" },
  { id: 'q27', tier: 1, active: true, text: "What's your favorite type of weather and why?" },
  { id: 'q28', tier: 1, active: true, text: "What's something about yourself that might surprise people?" },
  { id: 'q29', tier: 1, active: true, text: "What's a simple pleasure that brings you a disproportionate amount of joy?" },
  { id: 'q30', tier: 1, active: true, text: "What's something you're looking forward to in the next few months?" },
  { id: 'q31', tier: 1, active: true, text: "What animal would you say best represents your personality?" },
  { id: 'q32', tier: 1, active: true, text: "What's the most spontaneous thing you've ever done?" },
  { id: 'q33', tier: 1, active: true, text: "What's something you were really into as a kid that you still love now?" },

  // Tier 2 — Values & Meaningful Moments
  { id: 'q34', tier: 2, active: true, text: "Who has had the biggest influence on who you are today?" },
  { id: 'q35', tier: 2, active: true, text: "What's a moment where you felt really proud of yourself?" },
  { id: 'q36', tier: 2, active: true, text: "What's a fear you've overcome?" },
  { id: 'q37', tier: 2, active: true, text: "What does \"being a good friend\" mean to you?" },
  { id: 'q38', tier: 2, active: true, text: "What's a time you felt truly listened to?" },
  { id: 'q39', tier: 2, active: true, text: "What's something you wish you'd done differently — and what did you learn?" },
  { id: 'q40', tier: 2, active: true, text: "What's a quality you really admire in people?" },
  { id: 'q41', tier: 2, active: true, text: "What's something about your family or upbringing that shaped you?" },
  { id: 'q42', tier: 2, active: true, text: "What's a moment where you realized something important about yourself?" },
  { id: 'q43', tier: 2, active: true, text: "What makes you feel like you belong somewhere?" },
  { id: 'q44', tier: 2, active: true, text: "What's something you're grateful for that you rarely mention?" },
  { id: 'q45', tier: 2, active: true, text: "What's a moment where someone showed you unexpected kindness?" },
  { id: 'q46', tier: 2, active: true, text: "What does a genuinely good day feel like for you?" },
  { id: 'q47', tier: 2, active: true, text: "What's something you're learning to accept about yourself?" },
  { id: 'q48', tier: 2, active: true, text: "What's a strength you have that you sometimes downplay?" },
  { id: 'q49', tier: 2, active: true, text: "What's a time you stood up for something you believed in?" },
  { id: 'q50', tier: 2, active: true, text: "When do you feel most like yourself?" },
  { id: 'q51', tier: 2, active: true, text: "What's something you've had to let go of?" },
  { id: 'q52', tier: 2, active: true, text: "What brings you a sense of meaning or purpose?" },
  { id: 'q53', tier: 2, active: true, text: "What's a piece of advice you'd give to someone who's struggling?" },
  { id: 'q54', tier: 2, active: true, text: "What's something you're working on becoming better at — in life, not work?" },
  { id: 'q55', tier: 2, active: true, text: "What's a moment where you felt deeply connected to someone?" },
  { id: 'q56', tier: 2, active: true, text: "How do you show people you care about them?" },
  { id: 'q57', tier: 2, active: true, text: "What's something you've learned about yourself recently?" },
  { id: 'q58', tier: 2, active: true, text: "What's a time you chose growth over comfort?" },
  { id: 'q59', tier: 2, active: true, text: "What's something that used to frighten you that doesn't anymore?" },
  { id: 'q60', tier: 2, active: true, text: "When do you feel most energized — like time just disappears?" },
  { id: 'q61', tier: 2, active: true, text: "What's something you wish you'd known earlier in life?" },
  { id: 'q62', tier: 2, active: true, text: "What does your ideal version of friendship look like?" },
  { id: 'q63', tier: 2, active: true, text: "What's a failure that taught you something genuinely valuable?" },
  { id: 'q64', tier: 2, active: true, text: "When do you feel most at peace?" },
  { id: 'q65', tier: 2, active: true, text: "What's something about you that took you a long time to appreciate?" },
  { id: 'q66', tier: 2, active: true, text: "What matters to you more than money?" },
  { id: 'q67', tier: 2, active: true, text: "What's something you've learned from a difficult relationship?" },
  { id: 'q68', tier: 2, active: true, text: "What's a risk you took that paid off?" },
  { id: 'q69', tier: 2, active: true, text: "Who makes you want to be a better person, and why?" },
  { id: 'q70', tier: 2, active: true, text: "What's a belief about yourself you've had to let go of?" },
  { id: 'q71', tier: 2, active: true, text: "What's something that has gotten easier as you've gotten older?" },
  { id: 'q72', tier: 2, active: true, text: "What does love — of any kind — mean to you?" },
  { id: 'q73', tier: 2, active: true, text: "What's the kindest thing someone has ever done for you?" },
  { id: 'q74', tier: 2, active: true, text: "What moment made you feel most like an adult?" },
  { id: 'q75', tier: 2, active: true, text: "Who is someone in your life you should probably reach out to but haven't?" },
  { id: 'q76', tier: 2, active: true, text: "What's a small act of kindness that has stayed with you?" },

  // Tier 3 — Deep Connection
  { id: 'q77', tier: 3, active: true, text: "What's something you dream about doing or becoming?" },
  { id: 'q78', tier: 3, active: true, text: "What would you want people to remember about you?" },
  { id: 'q79', tier: 3, active: true, text: "What are you afraid of losing?" },
  { id: 'q80', tier: 3, active: true, text: "What does a meaningful life look like to you?" },
  { id: 'q81', tier: 3, active: true, text: "If you knew you couldn't fail, what would you do?" },
  { id: 'q82', tier: 3, active: true, text: "What's something you wish you could change about the world?" },
  { id: 'q83', tier: 3, active: true, text: "What would you regret most if you never did it?" },
  { id: 'q84', tier: 3, active: true, text: "What does \"home\" mean to you?" },
  { id: 'q85', tier: 3, active: true, text: "What's a version of yourself you're working toward becoming?" },
  { id: 'q86', tier: 3, active: true, text: "What's something that keeps you up at night — emotionally, not literally?" },
  { id: 'q87', tier: 3, active: true, text: "What's something you've sacrificed that you think was worth it?" },
  { id: 'q88', tier: 3, active: true, text: "What's a part of yourself you're learning to accept or forgive?" },
  { id: 'q89', tier: 3, active: true, text: "What would you want your closest friends to know about your inner world?" },
  { id: 'q90', tier: 3, active: true, text: "What's something you hope to pass on to others — wisdom, values, a way of being?" },
  { id: 'q91', tier: 3, active: true, text: "When have you felt like you made a real difference in someone's life?" },
  { id: 'q92', tier: 3, active: true, text: "What does happiness really mean to you — not the version you're supposed to want?" },
  { id: 'q93', tier: 3, active: true, text: "What's something you believe about people that shapes how you move through the world?" },
  { id: 'q94', tier: 3, active: true, text: "What's a moment where everything felt possible?" },
  { id: 'q95', tier: 3, active: true, text: "What does it mean to you to be truly known by someone?" },
  { id: 'q96', tier: 3, active: true, text: "What's something you're still figuring out about yourself?" },
  { id: 'q97', tier: 3, active: true, text: "What's a dream that feels impossible but that you haven't let go of?" },
  { id: 'q98', tier: 3, active: true, text: "When do you feel most alive?" },
  { id: 'q99', tier: 3, active: true, text: "If you could give one gift to the world, what would it be?" },
  { id: 'q100', tier: 3, active: true, text: "What's a story from your life that explains who you are today?" },
  { id: 'q101', tier: 3, active: true, text: "What are you most proud of in your entire life?" },
  { id: 'q102', tier: 3, active: true, text: "What's one thing you want the people in this room to know about you?" },
  { id: 'q103', tier: 3, active: true, text: "What part of your past has shaped you most?" },
  { id: 'q104', tier: 3, active: true, text: "What do you want more of in your life right now?" },
  { id: 'q105', tier: 3, active: true, text: "If the people here could only know one true thing about you, what would it be?" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectQuestions(total: number, pool: { id: string; tier: 1 | 2 | 3 }[]): string[] {
  const t1 = shuffle(pool.filter((q) => q.tier === 1));
  const t2 = shuffle(pool.filter((q) => q.tier === 2));
  const t3 = shuffle(pool.filter((q) => q.tier === 3));

  // Proportions: ~40% T1, ~40% T2, ~20% T3 (minimum 1 each)
  const n3 = Math.max(1, Math.round(total * 0.2));
  const n2 = Math.max(1, Math.round(total * 0.4));
  const n1 = Math.max(1, total - n2 - n3);

  return [
    ...t1.slice(0, n1),
    ...t2.slice(0, n2),
    ...t3.slice(0, n3),
  ].map((q) => q.id);
}
