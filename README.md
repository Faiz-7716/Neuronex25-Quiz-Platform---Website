# QuizVerse Showdown

An interactive quiz competition for the sharpest minds in tech. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **5 Exciting Rounds**: Tech Titans Challenge, Brand Busters Arena, Acronym Assassins, Cyber Security, and a manual Tie-Breaker round.
- **Real-time Scoreboard**: Live scoring with team elimination tracking.
- **Interactive Question Types**: Multiple choice and logo recognition.
- **Timer System**: Countdown timers with audio feedback.
- **Pass System**: Teams can pass questions to other teams (Rounds 1-3).
- **Responsive Design**: Works on desktop, tablet, and mobile devices.
- **Game State Management**: Save and restore game progress.
- **Smooth Animations**: Framer Motion powered transitions.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:9002`

## Game Format and Rules

### Scoring System
- **Direct Correct Answer**: +10 points
- **Passed Correct Answer**: +5 points (Rounds 1-3 only)
- **Wrong/No Answer**: 0 points

### Round 1: Tech Titans Challenge
- **Teams**: 10 teams start, 8 advance.
- **Format**: Basic computer and IT knowledge multiple-choice questions.
- **Timer**: 30 seconds per question.
- **Elimination**: The bottom 2 teams with the lowest scores are eliminated.

### Round 2: Brand Busters Arena
- **Teams**: 8 teams compete, 6 advance.
- **Format**: Logo identification questions. Teams must type the correct brand name.
- **Timer**: 30 seconds per logo.
- **Elimination**: The bottom 2 teams, based on cumulative scores, are eliminated.

### Round 3: Acronym Assassins
- **Teams**: 6 teams compete, 3 advance to the final.
- **Format**: Multiple-choice questions based on technology and computer science acronyms.
- **Timer**: 30 seconds per question.
- **Elimination**: The bottom 3 teams, based on cumulative scores, are eliminated.

### Round 4: Cyber Security
- **Teams**: 3 finalists compete for the championship.
- **Format**: Multiple-choice questions focused on cybersecurity concepts.
- **Timer**: 60 seconds per question.
- **No Passing**: Passing is disabled in the final round.
- **Winner**: The team with the highest total cumulative score at the end of this round is crowned the winner.

### Round 5: Tie Breaker (Manual Round)
- **Purpose**: This is a special round that is not part of the automatic game flow. It is intended for manual use by the quiz master to resolve ties.
- **Format**: Contains a set of general knowledge tech questions.
- **How to Use**: If a tie occurs that needs resolving (e.g., for the final advancement spots), the host can manually navigate to this round using the round selector dropdown. The host can then conduct a "first to answer" or "sudden death" challenge as they see fit to break the tie.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── quiz/           # Quiz-specific components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and data
│   ├── data.ts         # Questions and game data
│   ├── types.ts        # TypeScript type definitions
│   └── utils.ts        # Utility functions
└── hooks/              # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# Neuronex25-Quiz-Platform---Website
