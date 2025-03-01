import React, { useState } from 'react';
import './App.css';
import HabitGrid from './components/HabitGrid';

function App() {
  // Sample habit data for testing
  const [testHabit] = useState({
    id: 1,
    name: "Daily Exercise",
    description: "30 minutes of exercise each day",
    color: "#4CAF50",
    trackedDays: {
      // Add some sample completed days (today and a few days ago)
      "2025-03-01": true,  // Today
      "2025-02-28": true,  // Yesterday
      "2025-02-27": true,  // Day before yesterday
      "2025-02-25": true,  // With a gap
      "2025-02-20": true,
      "2025-02-19": true,
      "2025-02-18": true,
      "2025-01-15": true,
      "2025-01-14": true,
    }
  });

  // Function to toggle a day's completion status
  const handleToggleDay = (habitId, dateKey) => {
    console.log(`Toggled: Habit #${habitId}, Date: ${dateKey}`);
    // In a real app, this would update the habit state
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Habit Tracker</h1>
        <p>Track your daily habits and build streaks!</p>
      </header>
      
      <main className="App-main">
        <HabitGrid 
          habit={testHabit}
          onToggleDay={handleToggleDay}
        />
      </main>
    </div>
  );
}

export default App;