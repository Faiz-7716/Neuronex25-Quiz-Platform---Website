# QuizVerse Showdown

An interactive quiz competition application for the sharpest minds in tech. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **4 Exciting Rounds**: Tech Titans Challenge, Acronym Assassins, Brand Busters Arena, and Code Toaster Ultimate
- **Real-time Scoreboard**: Live scoring with team elimination tracking
- **Interactive Question Types**: Multiple choice, logo recognition, and code output questions
- **Timer System**: Countdown timers with audio feedback
- **Pass System**: Teams can pass questions to other teams (except in final round)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Game State Management**: Save and restore game progress
- **Smooth Animations**: Framer Motion powered transitions

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

## Game Rules

### Round 1: Tech Titans Challenge
- 10 teams start, 8 advance
- Basic computer knowledge MCQs
- 30 seconds per question
- Bottom 2 teams eliminated

### Round 2: Acronym Assassins
- 8 teams compete, 6 advance
- Technology acronym MCQs
- 30 seconds per question
- Bottom 2 teams eliminated

### Round 3: Brand Busters Arena
- 6 teams compete, 3 advance to final
- Logo identification questions
- 30 seconds per logo
- Bottom 3 teams eliminated

### Round 4: Code Toaster Ultimate
- 3 finalists compete
- Code output questions (Python, Java, C++)
- 60 seconds per question
- No passing allowed
- Winner determined by total points

## Scoring System

- **Direct Correct Answer**: +10 points
- **Passed Correct Answer**: +5 points (Rounds 1-3 only)
- **Wrong/No Answer**: 0 points

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