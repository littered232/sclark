// Eight single choice questions. Each option maps to one DISC letter.
// Tally answers, highest count wins (ties broken in D, I, S, C order).

export const DISC_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'When facing a tight deadline, I tend to',
    options: [
      { letter: 'D', label: 'Take charge and push the team to move faster' },
      { letter: 'I', label: 'Rally everyone with encouragement and energy' },
      { letter: 'S', label: 'Steadily work through the list without fuss' },
      { letter: 'C', label: 'Double check details to avoid mistakes under pressure' }
    ]
  },
  {
    id: 'q2',
    prompt: 'In a disagreement, I usually',
    options: [
      { letter: 'D', label: 'State my position directly and push for a decision' },
      { letter: 'I', label: 'Try to find common ground and keep things friendly' },
      { letter: 'S', label: 'Listen patiently and look for a way everyone feels okay' },
      { letter: 'C', label: 'Lay out the facts and reasoning before deciding' }
    ]
  },
  {
    id: 'q3',
    prompt: 'My friends would describe me as',
    options: [
      { letter: 'D', label: 'Bold and results driven' },
      { letter: 'I', label: 'Outgoing and enthusiastic' },
      { letter: 'S', label: 'Dependable and calm' },
      { letter: 'C', label: 'Precise and thoughtful' }
    ]
  },
  {
    id: 'q4',
    prompt: 'When starting a new project, I prefer to',
    options: [
      { letter: 'D', label: 'Jump in and figure it out as I go' },
      { letter: 'I', label: 'Brainstorm out loud with others' },
      { letter: 'S', label: 'Follow a clear, steady plan' },
      { letter: 'C', label: 'Research thoroughly before taking action' }
    ]
  },
  {
    id: 'q5',
    prompt: 'Under stress, I am most likely to',
    options: [
      { letter: 'D', label: 'Get impatient and want quick action' },
      { letter: 'I', label: 'Talk it out with someone' },
      { letter: 'S', label: 'Withdraw quietly to process' },
      { letter: 'C', label: 'Analyze what went wrong' }
    ]
  },
  {
    id: 'q6',
    prompt: 'I feel most satisfied when',
    options: [
      { letter: 'D', label: 'I have achieved a clear win' },
      { letter: 'I', label: 'I have connected with people' },
      { letter: 'S', label: 'Things feel stable and harmonious' },
      { letter: 'C', label: 'I have gotten it right' }
    ]
  },
  {
    id: 'q7',
    prompt: 'When giving feedback, I tend to',
    options: [
      { letter: 'D', label: 'Be blunt and to the point' },
      { letter: 'I', label: 'Frame it positively and encouragingly' },
      { letter: 'S', label: 'Deliver it gently and privately' },
      { letter: 'C', label: 'Back it up with specific examples' }
    ]
  },
  {
    id: 'q8',
    prompt: 'My biggest worry in a group setting is',
    options: [
      { letter: 'D', label: 'Losing control of the outcome' },
      { letter: 'I', label: 'Being ignored or seen as boring' },
      { letter: 'S', label: 'Conflict or letting people down' },
      { letter: 'C', label: 'Being wrong or looking unprepared' }
    ]
  }
];

export const DISC_STYLES = {
  D: {
    name: 'Driver',
    description: 'Direct, decisive, and driven by results. You move fast and value clear outcomes.'
  },
  I: {
    name: 'Influencer',
    description: 'Warm, expressive, and driven by connection. You energize the people around you.'
  },
  S: {
    name: 'Supporter',
    description: 'Steady, patient, and driven by harmony. You create a calm, dependable presence.'
  },
  C: {
    name: 'Analyst',
    description: 'Careful, precise, and driven by accuracy. You bring clarity through thorough thinking.'
  }
};

const LETTER_ORDER = ['D', 'I', 'S', 'C'];

export function scoreDiscAnswers(answersByQuestionId) {
  const tally = { D: 0, I: 0, S: 0, C: 0 };
  Object.values(answersByQuestionId).forEach((letter) => {
    if (tally[letter] !== undefined) tally[letter] += 1;
  });

  let winner = 'D';
  let highest = -1;
  LETTER_ORDER.forEach((letter) => {
    if (tally[letter] > highest) {
      highest = tally[letter];
      winner = letter;
    }
  });

  return {
    tally,
    letter: winner,
    style: DISC_STYLES[winner].name,
    description: DISC_STYLES[winner].description
  };
}
