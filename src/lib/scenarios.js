// Data for the three Daily Activities practice scenarios. Each scenario has
// two or three turns. Every turn offers suggested responses plus a free
// text option. The last scenario also tracks a second person's state.

export const SCENARIOS = [
  {
    id: 'catching-overwhelm-early',
    title: 'Catching overwhelm early',
    tagline: 'Notice the first signs before they build up',
    situation:
      'It is ten in the morning and your task list just doubled. You feel your chest tighten and your thoughts start to race.',
    hasSecondPerson: false,
    turns: [
      {
        prompt: 'What do you do first?',
        suggestions: [
          'Take three slow breaths before opening anything new',
          'Push through and start on the biggest task immediately',
          'Message a coworker to vent about the pile up'
        ]
      },
      {
        prompt: 'The feeling has not fully gone. What is your next move?',
        suggestions: [
          'Write down the three most important tasks and ignore the rest for now',
          'Keep switching between tasks to feel like you are making progress',
          'Step away from your desk for two minutes'
        ]
      }
    ],
    debrief:
      'Catching overwhelm early is about noticing the physical signal, the tight chest or racing thoughts, before it turns into a spiral. A short pause almost always pays for itself.'
  },
  {
    id: 'grounding-in-the-moment',
    title: 'Grounding in the moment',
    tagline: 'Steady yourself right before something stressful',
    situation:
      'You are two minutes from walking into a meeting that matters. Your hands feel cold and your mind keeps jumping ahead to what could go wrong.',
    hasSecondPerson: false,
    turns: [
      {
        prompt: 'How do you ground yourself before you walk in?',
        suggestions: [
          'Name five things you can see in the room right now',
          'Rehearse worst case scenarios one more time',
          'Take a slow walk to the door and back'
        ]
      },
      {
        prompt: 'You are at the door. What is the last thing you tell yourself?',
        suggestions: [
          'I am prepared enough, I can handle what comes up',
          'I have to be perfect in there',
          'It does not matter either way'
        ]
      }
    ],
    debrief:
      'Grounding works by giving your attention something concrete to hold onto right now, instead of a future that has not happened yet. The five senses and slow breathing both do this.'
  },
  {
    id: 'winding-down-after-hectic-day',
    title: 'Winding down after a hectic day',
    tagline: 'Reset with someone else in the room',
    situation:
      'You get home after a long, hectic day. Sam, who you live with, greets you right away and asks about dinner plans. You feel tense and a little short with them.',
    hasSecondPerson: true,
    secondPersonName: 'Sam',
    turns: [
      {
        prompt: 'How do you respond to Sam right at the door?',
        suggestions: [
          'Let them know you had a hard day and need five quiet minutes first',
          'Answer curtly and head straight to another room',
          'Mask it and jump right into planning dinner'
        ]
      },
      {
        prompt: 'Ten minutes later, Sam checks in on you again. What now?',
        suggestions: [
          'Thank them for checking in and share a little about your day',
          'Say you are fine even though you are still tense',
          'Ask for a bit more space before talking'
        ]
      },
      {
        prompt: 'You are both about to sit down together. How do you close the loop?',
        suggestions: [
          'Tell Sam you appreciate their patience tonight',
          'Say nothing and move on like it never happened',
          'Suggest doing something relaxing together'
        ]
      }
    ],
    debrief:
      'Winding down with someone else in the room means managing your own state while staying honest about what you need. A short heads up usually protects the relationship better than masking it.'
  }
];

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id);
}
