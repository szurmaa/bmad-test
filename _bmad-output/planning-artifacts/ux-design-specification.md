stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-core-experience", "step-04-emotional-response", "step-05-inspiration", "step-06-design-system", "step-07-defining-experience", "step-08-visual-foundation", "step-09-design-directions", "step-10-user-journeys", "step-11-component-strategy", "step-12-ux-patterns", "step-13-responsive-accessibility", "step-14-complete"]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/product-brief-habit-dice.md", "_bmad-output/planning-artifacts/architecture.md"]
lastStep: 14
status: complete
completedAt: '2026-04-10'
---

# UX Design Specification Habit Dice

**Author:** aszurma
**Date:** 2026-04-10

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

Habit Dice is a gentle, daily micro-habit app that replaces planning pressure with a single randomized action. The UX must make the product feel lighter than traditional habit apps: quick to enter, emotionally safe to skip, satisfying to complete, and easy to return to after absence. The interface should make showing up feel rewarding without using guilt, streak anxiety, or excessive gamification.

### Target Users

**Primary users:** Gen Z users, students, and ADHD users who have previously abandoned habit-tracking apps because they required too much setup, consistency, and emotional energy. These users are comfortable with mobile apps, but impatient with complexity and highly sensitive to shame-inducing product patterns.

**Secondary users:** Wellness content creators who can organically promote the product because the roll interaction is visually interesting, easily understood, and narratively shareable.

### Key Design Challenges

- Reduce decision fatigue to near-zero while still preserving a sense of autonomy
- Make the daily roll feel meaningful and delightful without becoming childish or gimmicky
- Design a days-played system that feels motivating without resembling streak punishment
- Ensure re-entry after missed days feels emotionally identical to a normal session
- Keep the experience calm and legible for users with low attention bandwidth
- Balance visual personality with ultra-low interaction friction

### Design Opportunities

- Create a signature roll interaction that becomes the emotional center of the product
- Use micro-celebration and completion moments to build satisfaction without pressure
- Differentiate from habit trackers through tone, pacing, and emotional UX rather than feature count
- Make the app feel safe to fail, which is itself a competitive UX advantage
- Design an interaction that is inherently shareable and creator-friendly without adding explicit social features

## Core User Experience

### Defining Experience

The core experience of Habit Dice is a fast, emotionally light daily ritual built around a single action: roll once, receive one tiny task, and either do it or move on without penalty. The product's value is delivered through reduction, not expansion. Users should never feel like they are managing a system. They should feel like the system has removed a burden for them.

The one interaction that must be absolutely right is the daily roll and reveal sequence. If that moment feels confusing, slow, childish, or emotionally off-tone, the product loses its differentiator. If it feels satisfying, clear, and gently surprising, the rest of the experience becomes believable.

### Platform Strategy

Habit Dice is a mobile-first product for iOS and Android. The primary interaction model is touch, brief-session usage, and frequent re-entry from push notifications. The UX should be designed for:
- one-handed mobile use
- sub-60-second sessions
- intermittent attention
- offline reliability
- re-entry from a notification directly into the roll flow

The app should assume users are often distracted, tired, in transit, or using the product between other activities rather than in a long focused session.

### Effortless Interactions

The following interactions must feel nearly frictionless:

- opening the app and understanding what to do immediately
- rolling for the day
- reading and understanding the task at a glance
- rerolling once without confusion
- marking the task complete
- logging mood in under a few seconds
- returning after missed days without any emotional or navigational penalty

Anything that requires explanation, setup, interpretation, or memory is a design smell. The UX should consistently remove, not add, cognitive steps.

### Critical Success Moments

The key make-or-break moments are:

- **First roll:** the user understands the product instantly and feels relief that they do not need to choose
- **First completion:** the user feels a small but real sense of closure, not a gamified reward blast
- **First missed-day return:** the app proves it is emotionally different from streak apps by making re-entry feel normal
- **First reroll:** the user sees that autonomy exists, but within a meaningful constraint
- **First mood-log reflection period:** the user begins to feel the product is helping, not just entertaining

If any of these moments fail, the app risks becoming either another guilt product or a novelty toy.

### Experience Principles

- **Reduce before adding:** every screen should lower cognitive load, not increase it
- **Gentle clarity over hype:** the product should feel calm, legible, and quietly confident
- **No punishment anywhere:** absence, skipping, and low-energy use must never create shame cues
- **Delight through restraint:** animation and celebration should feel intentional and lightweight, not loud
- **Instant comprehension:** users should know what to do within seconds of opening the app
- **Return should feel safe:** re-entry after time away must feel identical in dignity to daily use

## Desired Emotional Response

### Primary Emotional Goals

The primary emotional goal is **relief**. Users should feel that something mentally heavy has just become lighter. The product should remove pressure, not create motivation theater.

The secondary emotional goals are:
- gentle anticipation before the roll
- clarity at the moment of task reveal
- small accomplishment after completion
- emotional safety when skipping or returning
- quiet optimism over time as the ritual becomes familiar

### Emotional Journey Mapping

**Discovery / first impression:** users should feel curious and hopeful, not skeptical or intimidated. The product should immediately signal that this is small enough to actually do.

**First roll:** users should feel relief and surprise. The critical emotional win is: "I don't have to decide."

**Task reveal:** users should feel clarity, not ambiguity. The task should feel manageable, immediate, and non-threatening.

**Completion:** users should feel a small but real sense of closure and self-respect, not an exaggerated dopamine blast.

**Missed-day return:** users should feel safe, normal, and unjudged. This is one of the most important emotional differentiators in the product.

**Longer-term use:** users should gradually feel trust in the ritual. The app should start to feel like a supportive nudge rather than a system monitoring them.

### Micro-Emotions

The most important micro-emotions to design for are:

- relief instead of dread
- confidence instead of confusion
- trust instead of skepticism
- light delight instead of stimulation overload
- accomplishment instead of compliance
- permission instead of guilt

### Design Implications

- **Relief** requires immediate comprehension, low-friction onboarding, and no setup burden
- **Gentle anticipation** requires the roll animation to feel intentional and satisfying, but not loud or casino-like
- **Clarity** requires task presentation to be visually simple, instantly readable, and cognitively lightweight
- **Small accomplishment** requires completion feedback to be warm and affirming, not excessive
- **Emotional safety** requires removing all broken-streak language, missed-day alerts, and punishing visual cues
- **Trust** requires consistency in tone, predictable controls, and graceful offline behavior
- **Permission** requires the product to communicate "you can come back anytime" through both copy and flow behavior

### Emotional Design Principles

- **Never punish absence**
- **Reward presence quietly**
- **Make the next step obvious**
- **Use delight sparingly and precisely**
- **Reduce emotional friction as aggressively as functional friction**
- **Treat low-energy users as the default, not the exception**

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Wordle**
Wordle succeeds because it makes a once-a-day interaction feel meaningful without becoming operationally heavy. The UX is highly constrained: one core action, one clear state, one daily return point. For Habit Dice, the key transferable lesson is that constraint can increase emotional attachment when the interaction is simple and legible.

**Calm / Headspace**
These products are references for emotional tone rather than mechanics. They create gentleness, low urgency, and soft reassurance through pacing, copy, motion, and restraint. Their best lesson for Habit Dice is that calmness comes from removing pressure from the interaction model, not just from color or illustration.

**Duolingo**
Duolingo is useful both as inspiration and anti-pattern. It has excellent interaction clarity, strong completion feedback, and high ritual retention. But its streak framing, urgency mechanics, and guilt-adjacent push patterns are exactly what Habit Dice should reject. The lesson is to borrow the clarity and ritual strength while refusing the emotional leverage.

**Tarot / daily draw metaphors**
The relevant inspiration is the emotional structure: anticipation, reveal, interpretation, and personal meaning. Habit Dice should borrow the feeling of today's draw without becoming mystical or abstract.

### Transferable UX Patterns

**Daily ritual patterns**
- Single daily core interaction
- Strong today state
- Lightweight re-entry
- Constraint as identity-forming mechanic

**Interaction patterns**
- Reveal-based interaction with anticipation before result
- Clear, singular CTA rather than multiple competing choices
- Completion feedback that is short, satisfying, and emotionally proportional
- Limited reroll as a meaningful escape valve rather than endless optimization

**Visual and tone patterns**
- Soft pacing and whitespace from Calm / Headspace
- Crisp state clarity from Wordle
- Emotionally resonant reveal moment inspired by daily draw mechanics
- Micro-motion that supports meaning, not spectacle

### Anti-Patterns to Avoid

- Streak punishment mechanics like broken streak alerts, recovery anxiety, or loss framing
- Over-gamification such as noisy badges, excessive reward blasts, and point inflation
- Too many choices up front, including category selection, habit planning, or setup-heavy onboarding
- High-energy visual language that makes the product feel like a game before it feels trustworthy
- Ambiguous task presentation where the user must interpret what to do
- Nagging notification tone that implies obligation rather than invitation

### Design Inspiration Strategy

**What to adopt**
- Wordle's once-daily clarity and ritual simplicity
- Calm / Headspace's emotional pacing and low-pressure tone
- Reveal-oriented anticipation from daily-draw metaphors
- Immediate action legibility from high-performing habit and learning apps

**What to adapt**
- A reveal moment that feels special, but shorter and more functional than entertainment-first apps
- A completion moment that feels meaningful, but quieter than gamified reward loops
- A daily return mechanic that builds attachment without relying on fear of loss

**What to avoid**
- Duolingo-style streak pressure
- Habit-tracker dashboards that feel like accountability systems
- Notification and copy patterns that create shame, urgency, or self-judgment

The design strategy for Habit Dice should be: ritual clarity from Wordle, emotional softness from Calm, and anticipatory reveal from tarot-like draws, without importing the pressure mechanics of mainstream habit apps.

## Design System Foundation

### 1.1 Design System Choice

Habit Dice should use a custom lightweight mobile design system built on top of Expo / React Native primitives rather than a large prebuilt component library.

This means:
- custom design tokens for color, type, spacing, radius, motion, and elevation
- a small shared component set for core UI primitives
- bespoke interaction design for the dice roll, task reveal, and completion moments
- native accessibility and touch behavior preserved through React Native foundations

### Rationale for Selection

A heavier established system is the wrong fit for this product because Habit Dice is not a dashboard, enterprise workflow, or CRUD-heavy app. Its differentiator is emotional tone and interaction quality, not component breadth.

This choice is correct because:

- **The product needs emotional specificity.** The interface has to feel calm, safe, and slightly magical.
- **The UI surface is relatively small.** Habit Dice does not need a huge catalog of enterprise components.
- **The signature interaction is custom anyway.** The roll/reveal/completion flow is the product.
- **Consistency is still achievable.** A small internal system with explicit tokens and primitives is enough to keep implementation aligned across agents.

### Implementation Approach

The design system should be structured in three layers:

**1. Design tokens**
- color palette
- typography scale
- spacing scale
- radius scale
- shadow/elevation rules
- motion timing and easing
- semantic tokens for success, calm, emphasis, and muted states

**2. Core primitives**
- `Screen`
- `Text`
- `Button`
- `Card`
- `IconButton`
- modal or bottom-sheet pattern
- counter display pattern
- notification or banner pattern
- input controls only where needed

**3. Signature components**
- `DiceRoll`
- `TaskRevealCard`
- `CompletionMoment`
- `MoodLogPrompt`
- `DaysPlayedCounter`

The first design pass should define tokens and primitives before expanding into feature-specific UI.

### Customization Strategy

The system should be customized around these product qualities:

- calm over energetic
- readable over decorative
- warm over gamified
- distinctive through motion and tone, not visual noise
- mobile-native, thumb-friendly interaction defaults

The visual identity should come from restrained but memorable typography, soft but not sleepy color usage, generous spacing, crisp hierarchy, subtle motion with meaning, and a consistent emotional tone in copy and component behavior.

Avoid material-style generic surfaces, enterprise dashboard aesthetics, playful overload, reward-heavy gamification UI, and too many component variants too early.

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience of Habit Dice is: **open the app, roll once, receive one tiny task, and feel immediate relief that the decision has been made for you.**

This is the moment users will describe to other people. Not that it tracks habits, and not that it helps with productivity. The memorable interaction is: you roll, it gives you one thing to do, and it feels lighter than every other habit app.

If this interaction is compelling, clear, and emotionally safe, the product works. If it feels slow, confusing, overdesigned, or childish, the product becomes either a gimmick or just another tracker.

### 2.2 User Mental Model

Users arrive with the mental model of habit apps as systems of obligation:
- choose your habits
- commit to doing them
- track them daily
- feel bad when you fail

Habit Dice must deliberately replace that model with a new one:

- I do not plan
- I do not optimize
- I do not maintain a system
- I just roll and do one small thing if I can

Users should understand the product less like a planner and more like a daily draw, prompt, or nudge. The most important mental model shift is from management to discovery.

Likely confusion points to design against:
- assuming the app will ask them to set up habits
- not understanding the reroll constraint
- expecting punishment if they miss days
- mistaking the product for a game before understanding its utility

### 2.3 Success Criteria

The core interaction succeeds when:

- the user understands what to do within seconds of opening the app
- the roll feels intentional and satisfying, not random in a meaningless way
- the revealed task feels small enough to attempt immediately
- the reroll option feels understandable and fair
- completion creates a sense of closure without pressure
- re-entry after absence feels normal and emotionally unchanged

The strongest success signal is this internal reaction: **"Oh. That's it? I can do that."**

### 2.4 Novel UX Patterns

Habit Dice combines familiar patterns in a new way rather than inventing a totally foreign interaction.

**Established patterns being used:**
- daily ritual / once-per-day return loop
- reveal-based interaction
- lightweight task completion
- notification-driven re-entry

**Novel combination:**
- randomized task assignment as the primary habit UX
- additive days-played count without streak loss
- mood reflection attached to a low-pressure daily prompt instead of a self-improvement system

This means the UX should not feel experimentally strange. It should feel immediately understandable, but emotionally different from the category.

### 2.5 Experience Mechanics

**1. Initiation**
- User opens the app from icon or push notification
- Home screen immediately communicates the day's status
- If no roll has happened yet, the app presents one dominant action: roll

**2. Interaction**
- User taps the roll CTA
- Dice animation creates a short anticipation window
- App reveals one task with category, concise wording, and immediate readability
- If needed, user can reroll once using a clearly constrained escape hatch

**3. Feedback**
- The system confirms task selection clearly
- UI communicates whether reroll remains available
- Task completion produces a short, warm acknowledgment
- Mood log prompt appears as a lightweight optional close to the loop

**4. Completion**
- User leaves feeling done, not enrolled in more work
- The app records the day cleanly
- Days-played progress is visible without referencing missed days
- The next return point is simple: come back tomorrow and roll again

The mechanic should feel closer to a small daily ritual than to a productivity workflow.

## Visual Design Foundation

### Color System

Habit Dice should use a soft daylight palette that feels calm, reassuring, and lightly optimistic rather than clinical, gamified, or sleepy. Because the product's emotional goal is relief, the base UI should rely on warm neutrals and low-pressure surfaces, with accent colors used sparingly to guide action and mark meaning.

The recommended color strategy is:
- a warm off-white or light oat background for primary screens
- soft stone or mist neutrals for cards, dividers, and secondary surfaces
- a grounded blue-green or muted teal as the primary action color to communicate trust and calm
- a warm amber or apricot accent for reveal, completion, and gentle moments of delight
- restrained semantic colors for task categories, each chosen for distinctness without visual noise

Semantic mapping should include:
- **Primary:** muted teal or blue-green for the main roll CTA and core interactive emphasis
- **Secondary:** warm neutral tones for surfaces and supporting controls
- **Success:** soft green for completion acknowledgment
- **Warning / attention:** gentle amber for reroll availability or limited-state reminders
- **Error:** quiet rose-red reserved only for true failure states, not behavioral feedback
- **Muted:** stone-gray for metadata, secondary text, and low-priority UI chrome

The palette should avoid harsh black, neon saturation, aggressive gradients, and casino-like contrast. Visual energy should come from clarity and balance, not intensity. All core UI combinations should meet WCAG 2.1 AA contrast targets, especially for body text, buttons, and category labels.

### Typography System

The typography should feel modern, human, and reassuring. It should support extremely fast scanning on mobile while still giving the product enough character to feel intentional rather than generic.

The type strategy should prioritize:
- a clean, readable sans-serif for all primary interface text
- slightly more expressive weight and sizing in headings to create ritual-like emphasis
- short line lengths and generous line height for low-effort reading
- strong hierarchy so users can understand the screen state at a glance

Recommended hierarchy:
- **Display / hero:** used sparingly for the daily roll state or reveal moment
- **H1 / screen title:** used for major app states and top-level screens
- **H2 / section title:** used for supporting sections like mood history or task details
- **Body:** default reading text optimized for small mobile screens
- **Caption / metadata:** used for counters, labels, helper text, and timestamps

Typography should remain highly legible for low-attention users. Decorative font choices should be avoided. If an expressive secondary font is introduced at all, it should be reserved for a very limited role such as the roll reveal or celebration copy and never reduce readability.

### Spacing & Layout Foundation

Habit Dice should feel airy, calm, and easy to parse. The layout foundation should reduce clutter and reinforce the product's emotional promise that this is one small thing, not a system to manage.

The recommended spacing strategy is an 8-point base system, using generous vertical rhythm and clear grouping between content blocks. This provides enough flexibility for mobile layouts while keeping component spacing predictable for implementation.

Layout principles:
- prioritize one dominant action per screen whenever possible
- use generous top and bottom breathing room to avoid pressure and crowding
- keep content widths comfortable and centered within mobile-safe bounds
- group related information tightly, and separate unrelated content clearly
- maintain thumb-friendly spacing for all primary controls
- preserve strong visual focus on the roll, reveal, and completion states

The home screen should feel like a single-purpose ritual surface rather than a dashboard. Secondary content such as past mood logs or task history should be visually subordinate to the current daily action. Cards, counters, and prompts should use consistent padding and radius values so the interface feels coherent without requiring heavy decoration.

### Accessibility Considerations

Accessibility should be treated as part of emotional UX, not just technical compliance. A calm product fails if users must strain to read, interpret, or interact with it.

The visual foundation should therefore ensure:
- WCAG 2.1 AA contrast compliance for text and interactive controls
- scalable typography that remains readable under larger text settings
- touch targets sized appropriately for one-handed mobile use
- color meaning never used alone without supporting labels, icons, or structure
- motion used sparingly and with reduced-motion-friendly alternatives for roll and completion effects
- strong hierarchy and whitespace so users with low focus or cognitive fatigue can parse the interface quickly

The visual system should especially support users who are tired, distracted, or overwhelmed. Readability, clarity, and gentle pacing are more important than expressive flourish.

## Design Direction Decision

### Design Directions Explored

Six visual directions were explored for Habit Dice:

- **Direction 01 - Soft Ritual:** warm neutrals, centered hierarchy, and a calm ceremonial roll moment
- **Direction 02 - Editorial Calm:** typography-led and more reflective, with stronger emphasis on copy and reading rhythm
- **Direction 03 - Clear Compass:** cooler and more structured, with stronger card hierarchy and clearer state communication
- **Direction 04 - Playful Minimal:** brighter and more youthful, with more visible accent usage and lighter surfaces
- **Direction 05 - Daybreak Gradient:** more atmospheric and visually dramatic, using a staged reveal surface
- **Direction 06 - Grounded Natural:** earthy and wellness-oriented, with muted olive and clay tones

These directions varied primarily across hierarchy, density, palette expression, and how emotionally "special" the roll moment should feel.

### Chosen Direction

The recommended design direction is a combination of **Direction 01 - Soft Ritual** and selective structural elements from **Direction 03 - Clear Compass**.

The foundation should come from Direction 01:
- centered ritual composition
- warm daylight palette
- calm, reassuring screen tone
- generous spacing and soft emphasis

The supporting structure should come from Direction 03:
- clearer task card framing
- more legible state chips for reroll and daily status
- stronger secondary information hierarchy
- slightly more explicit system feedback where it improves comprehension

### Design Rationale

This combined direction best supports the Habit Dice product promise.

Direction 01 aligns most closely with the emotional goals established earlier:
- relief over pressure
- trust over stimulation
- permission over guilt
- delight through restraint

It makes the app feel emotionally safe and immediately understandable, which is critical for users who are overwhelmed by traditional habit-tracking UX.

Direction 03 adds useful clarity without shifting the tone into productivity software. This improves usability for distracted or low-energy users by making status, constraints, and task framing easier to parse at a glance.

Other directions were intentionally not chosen as the foundation:
- Direction 02 is elegant but slightly too text-led for the product's fast daily ritual
- Direction 04 introduces more playful energy than the product needs
- Direction 05 is memorable but visually heavier than ideal for the default state
- Direction 06 is warm and calm, but leans more lifestyle-wellness than product clarity

### Implementation Approach

The implementation approach for detailed design work should be:

- Use a centered, single-purpose home screen built around one dominant daily action
- Apply the warm neutral palette and restrained accent strategy from the visual foundation
- Use strong task-card framing and lightweight state chips for reroll availability, completion state, and days-played progress
- Keep secondary content visually subordinate to the current daily ritual
- Use motion sparingly, with the strongest motion reserved for roll anticipation and task reveal
- Let completion feedback feel warm and contained rather than celebratory or game-like

This direction should produce an interface that feels calm, clear, and memorable while remaining highly usable for low-attention mobile sessions.

## User Journey Flows

The user journeys defined in the PRD have been translated into detailed interaction flows. Each flow maps the critical user interactions from entry point through task completion, establishing the sequence of decisions, states, and feedback moments.

### Journey 1: Onboarding & First Roll

**Critical Interaction:** Get a new user to their first completed roll with zero friction, establishing the mental model that "this app makes decisions for me."

**Flow Diagram:**
```
Discover App → Download → Install + Open
  ↓
Notification Permission Prompt
├─ Allow → Proceed
└─ Skip → Proceed (non-blocking)
  ↓
Understand: "This is a daily dice roll"
  ↓
First Roll Button → Tap
  ↓
Roll Animation (< 2s, satisfying)
  ↓
Task Reveal with Category Badge
├─ Decision: Do I accept this?
├─ Yes, Tap "Do This Now"
│  └─ Task Completion Flow
└─ No, Tap "Reroll" (1 allowed today)
   └─ New Task Reveal → [Same options]
  ↓
Completion Animation (quiet, warm acknowledgment)
  ↓
Mood Log Prompt (lightweight, optional)
├─ Answer or Skip
└─ Dismiss
  ↓
Next Steps: "Your roll is done. Come back tomorrow."
```

**Key Design Moments:**
- Notification permission feels optional, not mandatory
- Roll animation communicates anticipation but not casino-like excitement
- Task reveal is instantly legible (category, effort, clear wording)
- Completion moment feels like closure, not a new commitment
- Mood log appears non-pressingly (optional, not required)

### Journey 2: Daily Happy Path (Returning User)

**Critical Interaction:** Enable the core 60-second ritual: open, roll, complete, log mood, close.

**Flow Diagram:**
```
Push Notification: "Your dice are ready"
  ↓
Tap Notification → App Opens
  ↓
Home Screen Display
├─ "18 days played"
├─ "1 reroll available today"
└─ Mood from yesterday (if answered)
  ↓
Today's Status: "Not rolled yet"
  ↓
Single Dominant CTA: "Roll for Today"
  ↓
Roll Animation → Task Reveal
├─ Category Color / Icon
├─ Clear, concise task (8–16 words max)
└─ CTAs: [Do It Now] [Reroll] [Save for Later]
  ↓
User Taps "Do It Now"
  ↓
Completion Confirmation
├─ "Done!" animation (1–2 seconds)
└─ Show updated days count (e.g., "19 days played")
  ↓
Mood Log Prompt (appears naturally after completion)
├─ Lightweight scale (emoji or simple response)
└─ CTAs: [Skip] [Quick emoji]
  ↓
Dismiss or Answer → Return to Home
├─ Today's roll state is "Complete"
├─ Mood is recorded
└─ App ready to close
```

**Key Design Moments:**
- No required setup before roll
- Today's roll is always the dominant action
- Completion is affirmed but not celebrated
- Mood logging is lightweight, not a survey
- App state is clean and uncluttered after completion

### Journey 3: Edge Case — Skip Days & Return

**Critical Interaction:** Prove that the app is emotionally safe when users disappear and return. This differentiates the product from streak apps.

**Flow Diagram:**
```
Day 14: User Completes Roll
  ↓
Days 15–17: Notifications Arrive, User Ignores Them
├─ No shame, no escalating pressure
└─ Standard copy: "Your dice are ready"
  ↓
Day 18: User Opens App Again
  ↓
Home Screen Displays:
├─ "14 days played" (NOT "4 days missed")
├─ "You're back!" (friendly, not guilt-inducing)
└─ "1 reroll available"
  ↓
[NOT SHOWN]:
├─ No "broken streak" message
├─ No "4 days away" penalty
├─ No shame-adjacent copy
└─ No comeback narrative
  ↓
Single CTA: "Roll for Today"
  ↓
[Proceed to Daily Happy Path Flow]
```

**Key Design Moments:**
- Counter shows cumulative days, not missed days
- Re-entry feels identical to a normal daily session
- No "comeback" narrative (which implies prior failure)
- Notifications don't punish absence
- Mental model: days played is memory, not judgment

### Journey 4: Reroll Constraint (One Per Day)

**Critical Interaction:** Offer autonomy (reroll option) while maintaining constraint (one per day). The reroll becomes a meaningful escape valve, not infinite optimization.

**Flow Diagram:**
```
Task Revealed (First Roll or After Previous Reroll)
  ↓
User Evaluates Task
├─ "I can do this" → Tap [Do It Now] → Completion Flow
└─ "I can't do this" → Tap [Reroll]
   ↓
   IF Reroll Available:
   ├─ Button Enabled, UI shows "1 Reroll Available"
   ├─ Roll Animation (slightly faster second draw)
   └─ NEW Task Revealed
      └─ User Must: [Do This One] OR [Skip Task]
   ↓
   IF Reroll NOT Available:
   ├─ Button Greyed Out, UI shows "Reroll used for today"
   └─ User Must: [Do It Now] or [Skip Task]
      └─ Either action completes the day's roll
```

**Key Design Moments:**
- First reroll is offered without penalty or smugness
- After reroll, constraint is clear (one per day)
- Second task is presented with same clarity
- Skipping both tasks (if necessary) is a valid outcome

### Journey 5: Mood Logging (End-of-Day Reflection)

**Critical Interaction:** Lightweight emotional check-in that feels supportive, not investigative.

**Flow Diagram:**
```
After Completion (or after skipping task)
  ↓
Mood Prompt Appears
├─ Copy: "How was today?" (warm phrasing)
├─ Display: Simple scale (1–5 emoji, or open response)
└─ Interaction: Single tap or quick response
  ↓
User Options:
├─ Answer Quickly (tap emoji / response)
├─ Skip (dismiss prompt without answer)
└─ [Either action closes the loop equally]
  ↓
Mood is Logged (or skipped) in Backend
├─ Sent to personal data store
└─ NOT used for gamification or streaks
  ↓
Return to Home
└─ Session is Complete
```

**Key Design Moments:**
- Mood log is positioned as reflection, not judgment
- Scale is simple (5 options max)
- Skip is equally valid (no pressure)
- User's mood data is private to them
- Copy stays warm and undemanding

### Journey 6: Admin Task Library Management

**Critical Interaction:** Internal team can update the task library without requiring an app release.

**Flow Diagram:**
```
Admin Opens Internal Web Tool
  ↓
View All Tasks
├─ Filter by: Category / Status / Completion Rate
└─ Display: Task text / Category / Effort / Status
  ↓
Identify Low-Performing Tasks
└─ Sort by: Completion Rate (ascending)
  ↓
Mark Task as Inactive
├─ Task removed from rotation (soft delete)
└─ Remains in DB for historical analytics
  ↓
Draft New Tasks
├─ Type task text
├─ Select category & effort
└─ Submit with status "Pending Approval"
  ↓
Approval Workflow
├─ Second team member reviews
└─ Approves or requests changes
  ↓
Server-Side Library Update
├─ Firestore collection is updated
├─ All app instances fetch new library
└─ Changes live within minutes (no app release)
  ↓
Analytics Feedback Loop
├─ Track performance of new tasks
└─ Informs next library iteration
```

**Key Design Moments:**
- Admin tool is simple CRUD, not complex workflow
- Soft-delete preserves analytics history
- Approval gate ensures quality
- Server-side updates enable rapid iteration
- Analytics loop closes for continuous improvement

## Journey Patterns

**Navigation Pattern 1: Single-Purpose Screens**
Each screen has one dominant action. No competing CTAs confuse the user. Meta information is secondary and subordinate.

**Navigation Pattern 2: Dismissal Without Penalty**
Users can skip mood logs, skip secondary options. Dismissal doesn't trigger shame messaging. App remains in a clean "ready" state after any dismissal.

**Decision Pattern 1: Constrained Reroll (Meaningful Escape Valve)**
Users get one reroll per day to preserve autonomy. After reroll, the next task is the final choice (do or skip). Constraint is clear and non-punishing.

**Decision Pattern 2: Optional Mood Logging**
Mood log is offered, not required. Skip is an equally valid action. Mood data is personal reflection, not gamification fuel.

**Feedback Pattern 1: Quiet Completion**
Completion animation is 1–2 seconds, warm, and contained. No trophy parade, badge explosion, or notification. Feedback affirms the action without over-celebrating.

**Feedback Pattern 2: Status is Always Additive**
Days-played counter only increases. No decrement for missed days. Return state is identical whether user returns after 1 day or 1 week.

## Flow Optimization Principles

1. **Minimize Steps to Completion:** A full session (roll → complete → mood → close) should take 60 seconds or fewer.

2. **Reduce Cognitive Load:** Each screen asks the user to make at most one decision. Information is chunked clearly.

3. **Clear Feedback:** Users always know whether their action succeeded (completion animation, counter update, state change).

4. **Graceful Skips:** Users can exit any non-critical path (mood log, reroll, saving for later) without shame or friction.

5. **Consistent Emotional Tone:** Every copy message, animation, and state change reinforces "I'm relieved, not obligated."

6. **Offline Reliability:** Core flows (roll, complete, mood, counter) all work without internet. Sync happens in the background when connectivity returns.

7. **Error Recovery:** If a sync fails or the app crashes mid-flow, the app returns to a clean state. Users never lose data or feel like they "failed" the app.

## Component Strategy

### Design System Components

The custom lightweight mobile design system from Step 6 provides a solid foundation with:

**Design Tokens:**
- Color palette with semantic mapping (primary teal, secondary warm neutrals, success green, warning amber, error rose)
- Typography scale (Display / H1 / H2 / Body / Caption)
- Spacing system (8pt base with predictable multiples)
- Radius, shadow, and motion timing rules

**Core Primitives:**
- `Screen` (top-level container with safe-area handling)
- `Text` (context-aware scaling)
- `Button` (clear affordance, primary CTAs)
- `Card` (contained information blocks)
- `IconButton` (compact, thumb-friendly)
- Modal / Bottom-Sheet pattern (secondary flows)
- Counter display pattern (for metadata)
- Notification / Banner pattern (inline feedback)
- Input controls (minimal, only where needed)

### Custom Components for Habit Dice

Beyond the design system, six signature components are custom-built to deliver the product's emotional promise:

#### DiceRoll

**Purpose:** Animate the primary daily action with anticipatory, satisfying motion that never reads as casino-like or gamified.

**Anatomy:**
- Geometric or abstract dice visual
- Smooth rotation animation with deceleration easing (~1.5–2 seconds)
- Optional subtle glow or particle effect
- Full-area tap target optimized for one-handed use

**States:**
- Idle: ready for tap, clear affordance
- Rolling: smooth deceleration animation
- Settling: final rotation slowing to stop
- Settled: rests on result, awaits task reveal

**Accessibility:**
- aria-label "Roll to get today's task"
- Respects prefers-reduced-motion setting
- Keyboard accessible (Space / Enter for testing)

#### TaskRevealCard

**Purpose:** Present the revealed task with category context and clarity so users instantly understand what they're asked to do.

**Anatomy:**
- Category badge (color-coded, semantic)
- Task text (large, centered, max 16 words)
- Optional effort indicator (Low / Medium / High)
- Action button row (Do It Now | Reroll | Save for Later)

**States:**
- Entering: subtle entrance animation
- Idle: ready for decision
- Tapped: highlight state, proceed to flow

**Content Guidelines:**
- Task text: clear, imperative wording ("Do X" not "Try X")
- Category: one word, color-coded
- Effort: optional but signals energy cost

#### CompletionMoment

**Purpose:** Provide brief, warm affirmation when task is marked complete. Feels like closure without celebration.

**Anatomy:**
- Subtle background color wash (warm tone)
- Checkmark or completion symbol (center)
- Optional particle or glow effect
- Updated counter display
- Affirming brief copy ("Done! That's X days played.")

**Duration:** 1–2 seconds

**Accessibility:**
- aria-live "assertive" announces completion
- Optional particle effect (performance-dependent)
- High contrast on all text

#### MoodLogPrompt

**Purpose:** Lightweight end-of-day reflection that feels invitational, never investigative.

**Anatomy:**
- Warm, open-ended prompt ("How was today?")
- 1–5 scale response (emoji or text)
- Skip button equally prominent
- Subtext emphasizing optional use

**States:**
- Shown: appears after completion
- Answered: user selected response, moves on
- Skipped: user dismisses without response
- Optional timeout: auto-dismisses after 30 seconds

**Variants:**
- Emoji scale (😞 😕 😐 🙂 😄)
- Text scale (Rough / Hard / Okay / Good / Great)

#### DaysPlayedCounter

**Purpose:** Display additive days-played count without streak language, penalty framing, or missed-day indicators.

**Anatomy:**
- Large number (e.g., "18")
- Label: "days played"
- Optional context: "You've shown up..." (never "X days since miss")
- Optional tap: shows weekly / monthly aggregation

**States:**
- Default: static display
- Incrementing: brief animation on count update
- Historical: distribution or timeline view

**Key Framing:**
- Always additive: "days played" not "streak"
- Never use penalty language: avoid "broke streak," "days missed"
- Example: "You've shown up 18 times. Great job."

#### RerollStateIndicator

**Purpose:** Clearly communicate whether today's reroll is available or used, without shame framing.

**Anatomy:**
- Icon or badge
- Label: "Reroll available" or "Reroll used today"
- Sub-label: when it resets ("Ready tomorrow")

**States:**
- Available: button enabled, clear affordance
- Used: button disabled, visual distinction, explanatory text

**Content Guidelines:**
- "Reroll used today" not "Reroll limit reached"
- "Your reroll is ready for tomorrow" (invitation, not penalty)
- No shame language

### Component Implementation Strategy

**Phase 1 — Critical Path (MVP):**
1. DiceRoll — core interaction, foundational
2. TaskRevealCard — critical UX clarity
3. CompletionMoment — emotional affirmation
4. MoodLogPrompt — end-of-day reflection
5. DaysPlayedCounter — additive progress
6. RerollStateIndicator — constraint clarity

**Phase 2 — Supporting Components (Launch + 2 weeks):**
- Past mood log view (history)
- Task filtering / search (if library grows)
- Notification preview (onboarding)
- Settings panel (customization)

**Phase 3 — Enhancement (Post-launch):**
- Admin analytics dashboard
- Mood trend visualization
- Creator mode / sharing
- Accessibility customization

### Technology & Structure

**Built with:**
- Expo / React Native + TypeScript
- Design tokens as constants
- React hooks for component state
- Reanimated v2 for custom animations
- No external UI library; components are purpose-built

**Organization:**
- `/src/components/core/` — foundational primitives (Screen, Text, Button, Card)
- `/src/components/signature/` — custom Habit Dice components
- `/src/design-tokens/` — color, typography, spacing constants
- `/src/hooks/` — shared stateful logic

**Design Consistency:**
- All components reference design tokens, not hardcoded values
- Figma design file mirrors component structure (one-to-one mapping)
- Accessibility built in from the start (WCAG 2.1 AA baseline)
- Motion respects prefers-reduced-motion

### Component Strategy Rationale

This approach balances proven design foundations with custom signature components that differentiate the product:

**Using the Design System:**
- Color, typography, spacing tokens
- Button and Card primitives
- Accessibility patterns baseline

**Building Custom:**
- DiceRoll (animated core interaction, emotional center)
- TaskRevealCard (clarity + category context)
- CompletionMoment (emotional affirmation without over-celebration)
- MoodLogPrompt (invitational, not investigative)
- DaysPlayedCounter (additive framing, never streak-oriented)
- RerollStateIndicator (constraint clarity without shame)

**Why This Works:**
- No heavy external library overhead
- Every component serves a specific emotional goal
- Lightweight, maintainable codebase aligned with architecture
- Components are testable and easy to refine
- Accessibility is built in, not an afterthought

## UX Consistency Patterns

### Button Hierarchy

**Primary CTA (Primary Action)**
- Examples: "Roll for Today", "Do It Now", "Mark Complete"
- Visual Design: Full-width or prominent size, primary teal color, clear affordance
- Touch Target: Minimum 44x44 pt, thumb-reachable
- States: Normal (ready), Active (pressed), Disabled (if contextually locked)

**Secondary CTA (Alternative Actions)**
- Examples: "Reroll", "Save for Later", "View History"
- Visual Design: Same size as primary but secondary color (warm neutral), less visual weight
- Behavior: Alternative paths forward, equally accessible
- Positioning: Directly below or adjacent to primary CTA
- Always visible and never hidden in menus

**Tertiary / Skip Button (Low-Commitment Actions)**
- Examples: "Skip", "Not Now", "Dismiss"
- Visual Design: Text-only or very subtle styling, low visual weight
- Behavior: Allow users to exit without penalty
- Emotional Tone: Never shame-inducing ("I can come back to this")
- Key Rule: Skip is always equally available as the positive action

**Disabled Button Pattern**
- Example: "Reroll" button when reroll is already used
- Visual Design: Low contrast, greyed-out, but still readable
- Accompanying Text: Always explain when/why it's disabled ("Reroll used today. Ready tomorrow.")
- Keyboard State: Still tab-navigable for accessibility, but non-functional
- Never Use: Lock icons, cross-outs, or penalty language

### Feedback Patterns

**Completion Feedback**
- Trigger: User taps "Do It Now" or marks a task complete
- Visual: Warm color wash (1–2 second animation), checkmark or completion symbol
- Copy: Affirming but brief ("Done! That's X days played.")
- Sound: Optional; respects system mute switch
- Next Action: Automatically advances to Mood Log prompt or home
- Key Rule: Affirm the action, don't celebrate excessively

**Success State**
- Used for: Task completion, mood logged, positive confirmations
- Color: Soft green (semantic success color)
- Icon: Checkmark or subtle affirmation
- Duration: Brief (1–2 seconds)
- Motion: Understated, not explosive

**Error / Problem State**
- Used for: Network failures, sync issues, validation failures (rare in this app)
- Color: Quiet rose-red (semantic error color)
- Copy: Clear explanation without technical jargon
- Recovery: Always provide a clear next step ("Try again" button)
- Key Rule: Errors don't blame the user; they offer solutions

**Loading State**
- Used for: Roll animation, background syncs, updates
- Visual: Subtle spinner or progress indicator, never intrusive
- Duration: Show immediately if operation takes >500ms
- Placeholder: Show skeleton/placeholder if main content is loading
- Respects: Reduced motion setting (use pulsing instead of spinning)

**Informational Feedback**
- Used for: Reroll availability, days-played updates, gentle reminders
- Copy: Warm and invitational ("Your reroll is ready for tomorrow")
- Visibility: Always present, never nagging notifications within app
- Tone: Permission-granting, never obligatory

### Form Patterns

Habit Dice minimizes forms. The only significant form pattern is the mood log.

**Mood Log Scale (Lightweight Form)**
- Type: Simple response scale, not complex survey
- Options: 5 responses maximum (emoji or text)
- Skip: Always available, equally prominent
- Validation: No validation; user can skip without error
- Accessibility: Each option has aria-label, keyboard navigable
- Post-Answer: Brief confirmation, then dismiss
- Key Rule: Emphasize optional use; gather data, don't interrogate

### Navigation & Flow Patterns

**Linear Flow Navigation (Primary Pattern)**
- Habit Dice uses a simple linear progression, not tab-based navigation
- Screens progress in sequence: Home → Roll → Task Reveal → Complete → Mood Log → Home
- Back Button: Rarely used; flows are unidirectional
- Dismissal: "Skip" and "Not Now" are the main backward exits, without penalty

**Home Screen (Single Entry Point)**
- Primary navigation hub; all other screens are task-driven flows
- Single dominant action: "Roll for Today"
- Secondary content: Days played, past mood summary (if shown)
- No hidden menus, no hamburger navigation
- Always one tap away from the core roll interaction

**Flow Dismissal (Graceful Exit)**
- User can dismiss any non-critical flow (mood log, history, settings)
- Dismissal is not failure; it's a valid interaction
- Copy: "Skip", "Not now", "Maybe later" — language emphasizes permission
- State Preservation: Dismissing a flow doesn't reset progress

**Modal / Bottom-Sheet Pattern (Minimal Use)**
- Used for: Mood log prompt, optional history view, minimal settings
- Size: Does not cover entire screen; allows context visibility
- Dismiss: Top-right X button, swipe-down dismissal, or outside tap
- Appearance: Slides up from bottom (iOS) or animates in below top (Android)
- Duration: Lightweight modals appear and disappear quickly

### Disabled & Constrained States

**Reroll Unavailable Pattern**
- Trigger: User has already rerolled once today
- Visual State: Button is greyed out, visually distinct but still readable
- Accompanying Text: Always explain the constraint ("Reroll used today. Ready tomorrow at midnight.")
- No Penalty Language: Never say "limit reached," "you failed," or similar
- Keyboard: Tab-navigable but non-functional
- Next Step: User can still "Do It Now" or "Save for Later"

**Animation Lock (Cannot Interact During Animation)**
- During roll animation or completion animation: buttons are disabled
- Visual: Buttons fade slightly or show disabled state
- Duration: Brief (1–2 seconds max)
- Reason: Prevent double-rolls or interrupting animations
- Recovery: After animation, buttons return to enabled state automatically

**Offline Limitation**
- Pattern: Core actions (roll, complete, mood) work offline
- Secondary features (history, sync status) show lightweight explanations
- No Error Shaming: "Offline" is communicated as fact, not failure
- Auto-Recovery: When connectivity returns, sync happens silently

### Empty & Loading States

**First-Time User (Empty State)**
- Trigger: App opened for the first time
- Visual: Minimal, welcoming, warm
- Copy: "Roll once to get your first task." (Clear, single action)
- No Onboarding: Skip complex walkthroughs; let users roll immediately
- Safety: No commitment required to roll

**Task History Empty**
- If shown: "No mood history yet. Start rolling to see your pattern."
- Visual: Placeholder or light background
- Action: "Roll now" CTA
- Tone: Invitational, not scolding

**Loading / Sync In Progress**
- Visual: Subtle spinner or pulsing placeholder (respects reduced motion)
- Copy: Optional; can be silent if operation is quick
- Timeout: Show offline fallback after 10 seconds if no response
- Recovery: Always present an actionable next step

**No Internet State**
- Pattern: App functions in offline mode; shows lightweight indication
- Copy: "Working offline. Will sync when connected." (fact, not apology)
- Icon: Subtle icon (no red X or alarm symbols)
- Recovery: Syncs automatically when connectivity returns

### Micro-interactions & Motion

**Roll Animation Pattern**
- Duration: 1.5–2 seconds
- Easing: Deceleration (fast to slow)
- Feel: Anticipatory, satisfying, not chaotic
- Skip: User can tap to skip, revealing result immediately
- Accessibility: Respects prefers-reduced-motion (uses fast direct reveal instead)

**Completion Animation Pattern**
- Duration: 1–2 seconds
- Motion: Subtle color wash, checkmark entrance, brief hold
- Easing: Gentle, smooth
- Next Action: Automatically advances after animation
- Accessibility: No motion required; can be a static confirmation

**Transition Pattern**
- Between screens: Subtle fade or soft slide
- Duration: 300–400ms
- Skip: Users can tap to skip transition
- Accessibility: Respects prefers-reduced-motion (instantaneous or no-motion version)

**Hover & Press States (Touch Targets)**
- Hover (if applicable on web version): Slight color shift, no heavy shadow
- Press: Clear feedback (slight scale down, color deepened)
- Release: Smooth return to normal state
- Key Rule: Feedback is subtle; motion supports clarity, not distraction

### Copy & Tone Patterns

**Primary CTA Copy**
- Positive, action-oriented language
- Examples: "Roll for Today", "Do It Now", "Mark Complete"
- Tone: Direct, permission-granting
- Avoid: Exclamation marks (unless truly celebratory), urgency language

**Secondary CTA Copy**
- Calm, low-pressure alternatives
- Examples: "Save for Later", "Reroll", "View History"
- Tone: Equal in status to primary, not subordinate
- Avoid: Apologetic language ("Sorry, try another", "Failed to...")

**Skip / Dismiss Copy**
- Explicitly permission-granting
- Examples: "Skip", "Not now", "Maybe later", "I'll pass"
- Tone: Warm, non-judgmental
- Key Rule: Dismissal is a valid choice, not failure

**Constraint / Limitation Copy**
- Factual and kind
- Example: "Reroll used today. Ready tomorrow at midnight."
- Avoid: "Reroll limit reached," "You can't reroll," penalty language
- Tone: Informative, not punishing

**Affirmation Copy**
- Brief, warm
- Examples: "Done! That's 18 days played.", "Great reflection today."
- Tone: Genuine appreciation, not over-the-top celebration
- Avoid: Excessive exclamation marks, "congratulations" tone

**Error Copy**
- Clear explanation, helpful solution
- Example: "Can't roll offline right now. We'll sync when connected."
- Avoid: Technical jargon, blame ("This failed", "You didn't...")
- Tone: Supportive, solution-focused

### Accessibility Patterns

**Color Use Pattern**
- Rule: Color is never the only indicator of state
- Example: Disabled button is greyed + includes text "Reroll used today"
- Contrast: All text meets WCAG 2.1 AA minimum
- Semantic Colors: Primary (action), Success (green), Warning (amber), Error (rose) have consistent meaning

**Text Hierarchy Pattern**
- Heading text: Larger, heavier weight, scannable
- Body text: Comfortable reading size, generous line height
- Caption text: Still readable, not tiny
- Key Rule: No text below 12pt on mobile

**Interactive Element Pattern**
- Minimum touch target: 44x44 pt
- Spacing: At least 8pt between touch targets
- Keyboard: All interactive elements are keyboard navigable
- Focus Indicators: Clear, visible focus ring on keyboard navigation

**Screen Reader Pattern**
- aria-label on icon-only buttons
- aria-live regions for dynamic content (completion, updates)
- Heading structure properly ordered (h1, h2, h3)
- Form labels associated with inputs

### Pattern Consistency Rules

**Apply Universally:**
1. Every disabled state includes explanatory text
2. Every dismissable action has non-penalty language
3. Every error includes a recovery action
4. Every animation respects prefers-reduced-motion
5. Every button touch target is at least 44x44 pt
6. Every color use is paired with text or icon reinforcement

**Tone Rule:**
All interactions reinforce: "I'm relieved, not obligated. I'm supported, not judged."

## Responsive Design & Accessibility

### Responsive Strategy

**Primary Platform: Mobile (React Native / Expo)**
Habit Dice is fundamentally a mobile app. Responsive design focuses on supporting iOS and Android devices, not web desktop adaptations.

**Mobile Design Principles:**
- Single-column layout (no multi-column complexity)
- Content stacked vertically for natural scrolling
- One-handed usability is default, not edge case
- Touch-first interaction, no hover states as primary interaction
- Safe areas respected (notches, home indicators on iOS; system gestures on Android)
- Full-width CTAs for reachability

**Device Considerations:**

| Device Type | Screen Size | Strategy |
| --- | --- | --- |
| Small phones | 320–375px | Single-column, generous spacing, no small touch targets |
| Standard phones | 375–428px | Comfortable reading width, centered content |
| Large phones | 428–480px | Same UX as standard; extra space used for breathing room |
| Foldables | Variable | Test on physical devices; use safe areas; no assumptions about continuous screens |

**Tablet Strategy (Secondary Support):**
- No tablet-specific redesign for MVP
- App scales up on tablets using the same mobile layout
- No multi-column or side-panel layouts in core experience
- Users on tablets still use the same single-column flow

**Admin Web App (Separate Product):**
- The internal admin tool is web-based (separate from mobile app focus)
- Desktop-first for task library management
- Can use traditional web responsive patterns
- Not part of this UX spec (handled separately)

### Breakpoint Strategy

**Against Custom Breakpoints:**
Habit Dice does NOT use traditional CSS breakpoints because it's built on React Native / Expo, which does not use media queries. Instead, responsive behavior is handled through:

1. **Flexbox Layout (React Native Flex Box)**
   - Components adapt to available space automatically
   - No breakpoints needed; layout is fluid

2. **Safe Area Insets**
   - useSafeAreaInsets hook handles notches, home indicators, system UI
   - Automatic padding applied around dangerous areas

3. **Dimension Listener (Optional)**
   - Monitor window size for specific adaptations
   - Rarely needed due to Expo's automatic scaling

**Responsive Decisions:**
- If a component needs to change behavior based on screen size, use useWindowDimensions() hook
- Set a minimum content width (recommend 320px) to ensure readability on smallest phones
- Scale typography and spacing using relative units

### Accessibility Strategy

**WCAG 2.1 Level AA Compliance Target**

Habit Dice serves users with ADHD, low attention, and anxiety about productivity. Accessibility is core to the emotional UX, not an add-on.

**Visual Accessibility**
- **Color Contrast:** All text and interactive elements meet WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)
- **Color as Information:** Never use color alone to convey meaning (combine with icon, text, or pattern)
- **Text Sizing:** No text smaller than 12pt on mobile; minimum 14pt for body text
- **Large Text Support:** App functions with system text sizes up to 200%
- **Dark Mode Support:** Color scheme works in both light and dark modes

**Motor & Touch Accessibility**
- **Touch Targets:** All interactive elements minimum 44x44 pt
- **Touch Spacing:** At least 8pt between adjacent touch targets
- **Tap Areas:** Generous touch targets for primary CTAs (often 50–56pt)
- **One-Handed Use:** All elements reachable without stretching thumb across full screen
- **No Gesture Requirements:** Core actions don't require complex gestures
- **Keyboard Support:** All interactive elements keyboard navigable

**Cognitive Accessibility (Critical for ADHD Users)**
- **Single-Purpose Screens:** Each screen has one dominant action; no cognitive overload
- **Clear Language:** All copy avoids jargon and complex sentences
- **Consistent Patterns:** Same action always looks and behaves the same way
- **Distraction Minimization:** No auto-playing video, low-energy design, quiet animations
- **Skip Options:** Users can skip non-essential flows without penalty
- **Error Prevention:** Forms are minimal; errors are rare and handled kindly

**Auditory Accessibility**
- **No Audio Cues as Only Feedback:** If sound plays, visual feedback also occurs
- **Respect System Sound Settings:** Honor mute switch; don't force audio
- **No Requirement for Hearing:** All interactions work with or without sound

**Screen Reader Support**
- **Semantic Structure:** All screens have proper heading hierarchy (H1, H2, H3)
- **ARIA Labels:** Icon-only buttons have descriptive aria-label
- **aria-live Regions:** Dynamic content announces to screen readers
- **Form Associations:** All form inputs properly labeled
- **List Structures:** Use semantic list components for related items
- **Screen Reader Testing:** Tested with iOS VoiceOver and Android TalkBack

**Motion & Animation Accessibility**
- **Reduced Motion Support:** App respects prefers-reduced-motion system setting
  - Roll animation: Direct reveal (no spinning) if reduced motion is on
  - Completion animation: Instant or very fast
  - Transitions: Instantaneous or minimal
- **No Mandatory Motion:** Motion is always optional; static version always available
- **Animation Duration:** Animations are fast (< 400ms) to avoid motion sickness triggers

**Language & Clarity**
- **Plain Language:** All copy avoids technical jargon, complex sentences, idioms
- **Consistent Terminology:** Same concept always uses same word
- **Readable Formatting:** No walls of text; information chunked visually
- **Warnings & Errors:** Clear, actionable, not shame-inducing

### Testing Strategy

**Responsive Testing:**
1. **Device Testing**
   - Test on actual physical devices (minimum one iOS phone, one Android phone)
   - Include smallest common device (iPhone SE or equivalent)
   - Include largest common device (iPhone Pro Max or Android equivalent)
   - Test in both portrait and landscape orientations
   - Test with system zoom/text scaling enabled (up to 200%)

2. **Network Simulation**
   - Test on 3G/4G to simulate real user conditions
   - Verify offline behavior works as designed
   - Test sync behavior on slow connections

3. **Landscape Orientation**
   - Ensure control layout remains thumb-reachable in landscape
   - Verify nothing essential is cut off

**Accessibility Testing:**
1. **Automated Testing**
   - Use jest-axe for React testing
   - Lighthouse accessibility audits
   - Pre-launch accessibility scan tools

2. **Screen Reader Testing**
   - **iOS:** VoiceOver (built-in)
   - **Android:** TalkBack (built-in)
   - Test all primary user journeys with screen reader enabled
   - Verify page structure is logical and semantic
   - Ensure aria-labels are descriptive and useful

3. **Keyboard Navigation Testing**
   - Tab through entire app to verify focus order
   - Verify skip links work
   - Test all CTAs and inputs are keyboard accessible
   - Verify focus indicator is always visible

4. **Visual Testing**
   - **Color Contrast:** Verify 4.5:1 on all text
   - **Color Blindness:** Use Colorblind Simulator
   - **Zoom Testing:** Verify usability at 200% zoom
   - **Dark Mode:** Test in both light and dark mode

5. **Motor Accessibility Testing**
   - Verify all touch targets are at least 44x44 pt
   - Ensure spacing prevents mis-taps
   - Verify one-handed reach

6. **User Testing with Disabilities**
   - Include ADHD users in beta testing
   - Include users who rely on screen readers
   - Include users with low vision or colorblindness
   - Test with actual assistive technologies

### Implementation Guidelines

**Responsive Development (React Native):**
1. **Use Flexbox & Safe Areas**
   - Build layouts with flexbox; avoid fixed pixel widths where possible
   - Use useSafeAreaInsets() to respect notches and system UI
   - Test on multiple screen sizes during development

2. **Typography Scaling**
   - Use scaleFactor sparingly
   - Keep typography hierarchy consistent across screens
   - Ensure minimum font size is readable (12pt minimum)

3. **Touch Target Sizing**
   - All buttons and interactive elements minimum 44x44 pt
   - Use consistent spacing between elements (8pt base system)
   - Test touch accuracy on actual devices

4. **Image & Asset Optimization**
   - Provide images at appropriate resolutions (1x, 2x, 3x)
   - Use scalable assets (SVGs) where possible
   - Optimize file sizes for mobile networks

**Accessibility Development:**
1. **Semantic Structure**
   - Use SafeAreaView, View, Text semantically
   - Use accessibilityRole to define element purpose
   - Use accessibilityLabel on icon-only components

2. **Screen Reader Support**
   - Ensure all text and buttons have descriptive labels
   - Use aria-live regions for dynamic content
   - Test with actual screen readers (VoiceOver, TalkBack)

3. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard navigable
   - Define logical tab order
   - Provide visible focus indicators

4. **Reduced Motion Support**
   - Check prefers-reduced-motion setting
   - Provide static or very fast animations when reduced motion is enabled

5. **High Contrast Support**
   - Test colors in high-contrast mode
   - Ensure functionality isn't dependent on visual distinction alone

### Accessibility Compliance Checklist

Before launch, verify:
- ✅ All text meets 4.5:1 contrast ratio (WCAG 2.1 AA)
- ✅ All interactive elements are minimum 44x44 pt
- ✅ All buttons and links have descriptive labels
- ✅ Dynamic content announces to screen readers
- ✅ App works with system text zoom (up to 200%)
- ✅ No interactions require complex gestures
- ✅ Keyboard navigation works end-to-end
- ✅ Motion respects prefers-reduced-motion setting
- ✅ Color is never the only indicator of meaning
- ✅ Tested with VoiceOver (iOS) and TalkBack (Android)
- ✅ Tested with actual ADHD users and low-attention users
- ✅ Error messages are clear and supportive
