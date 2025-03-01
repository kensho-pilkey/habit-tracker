import React from 'react';
import './HabitStats.css';

const HabitStats = ({ habit }) => {
  if (!habit) return null;
  
  // Helper function to format date as YYYY-MM-DD
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Calculate current streak
  const calculateCurrentStreak = () => {
    if (!habit || !habit.trackedDays) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i <= 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = formatDateKey(date);
      
      if (habit.trackedDays[dateKey]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    if (!habit || !habit.trackedDays) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    
    // Sort all tracked days
    const trackedDays = Object.keys(habit.trackedDays).sort();
    
    for (let i = 0; i < trackedDays.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        // Check if the previous day is consecutive
        const prevDate = new Date(trackedDays[i-1]);
        const currentDate = new Date(trackedDays[i]);
        prevDate.setDate(prevDate.getDate() + 1);
        
        if (prevDate.toDateString() === currentDate.toDateString()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    }
    
    return longestStreak;
  };
  
  // Calculate total completions
  const calculateTotalCompletions = () => {
    return habit && habit.trackedDays ? Object.keys(habit.trackedDays).length : 0;
  };
  
  // Calculate monthly rate
  // const calculateMonthlyRate = () => {
  //   if (!habit || !habit.trackedDays) return 0;
    
  //   const today = new Date();
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  //   const daysElapsed = Math.min(today.getDate(), daysInMonth);
    
  //   let completedDays = 0;
  //   for (let i = 0; i < daysElapsed; i++) {
  //     const date = new Date(startOfMonth);
  //     date.setDate(date.getDate() + i);
  //     const dateKey = formatDateKey(date);
      
  //     if (habit.trackedDays[dateKey]) {
  //       completedDays++;
  //     }
  //   }
    
  //   return Math.round((completedDays / daysElapsed) * 100);
  // };
  
  // Calculate best day of the week
  const calculateBestDay = () => {
    if (!habit || !habit.trackedDays) return "N/A";
    
    const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
    
    Object.keys(habit.trackedDays).forEach(dateKey => {
      const date = new Date(dateKey);
      const dayOfWeek = date.getDay();
      dayCount[dayOfWeek]++;
    });
    
    const maxCount = Math.max(...dayCount);
    if (maxCount === 0) return "N/A";
    
    const bestDayIndex = dayCount.indexOf(maxCount);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[bestDayIndex];
  };
  
  return (
    <div className="habit-stats">
      <h3>{habit.name} Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">{calculateCurrentStreak()} days</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Longest Streak</span>
          <span className="stat-value">{calculateLongestStreak()} days</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Completions</span>
          <span className="stat-value">{calculateTotalCompletions()} days</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Best Day</span>
          <span className="stat-value">{calculateBestDay()}</span>
        </div>
      </div>
    </div>
  );
};

export default HabitStats;