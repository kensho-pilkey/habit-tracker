# 365-Day Habit Tracker
A GitHub-style habit tracking web application built with React. This app allows users to visualize their habit streaks similar to GitHub's commit graph.

https://kensho-pilkey.github.io/habit-tracker/


<img width="1507" alt="Screenshot 2025-03-01 at 4 11 00 PM" src="https://github.com/user-attachments/assets/e5f9c67a-1d88-49c4-a6b9-0494f2b95fb7" />

## Features

- **Visual Streak Tracking**: Track your habits with a GitHub-style contribution graph
- **Multiple Habits**: Create and manage multiple habits with different colors
- **Persistence**: All data is saved to localStorage, so your progress is preserved between sessions
- **Statistics**: View current streaks, longest streaks, and completion rates for each habit
- **Customization**: Choose from various colors to personalize each habit

## How It Works

- **Add a habit**: Fill out the form with a name, description, and choose a color
- **Track your progress**: Click on any day in the grid to mark that habit as completed for that day
- **Edit habits**: Update habit details with the edit button
- **Delete habits**: Remove habits you no longer want to track
- **View statistics**: See your streaks and completion rates for each habit

## Technologies Used

- React (with Hooks)
- CSS for styling
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habit-tracker.git
   ```

2. Navigate to the project directory:
   ```
   cd habit-tracker
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

This app can be easily deployed to GitHub Pages or any static hosting service since it doesn't require a backend server.

To deploy to GitHub Pages:

1. Install the gh-pages package:
   ```
   npm install --save gh-pages
   ```

2. Add the following to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/habit-tracker",
   "scripts": {
     // ...
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```
   npm run deploy
   ```

## Future Enhancements

- Add additional graphs and visualizations
- Add user accounts for multi-device syncing
- Implement categories for habits
- Add reminder notifications
- Create weekly and monthly view options
- Add data export/import functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
