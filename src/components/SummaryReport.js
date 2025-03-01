import React from 'react';
import './SummaryReport.css';

const SummaryReport = ({ habits }) => {
  if (!habits || habits.length === 0) {
    return (
      <div className="summary-report">
        <h3>Summary Report</h3>
        <p className="no-data-message">Add habits to see your summary statistics.</p>
      </div>
    );
  }
  
  // Helper function to format date as YYYY-MM-DD
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Calculate longest streak for a habit
  const calculateLongestStreak = (habit) => {
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
  
  // Calculate total completions for a habit
  const calculateTotalCompletions = (habit) => {
    return habit && habit.trackedDays ? Object.keys(habit.trackedDays).length : 0;
  };
  
  // Calculate completion rate for the current month
  const calculateMonthlyRate = (habit) => {
    if (!habit || !habit.trackedDays) return 0;
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.min(today.getDate(), daysInMonth);
    
    let completedDays = 0;
    for (let i = 0; i < daysElapsed; i++) {
      const date = new Date(startOfMonth);
      date.setDate(date.getDate() + i);
      const dateKey = formatDateKey(date);
      
      if (habit.trackedDays[dateKey]) {
        completedDays++;
      }
    }
    
    return Math.round((completedDays / daysElapsed) * 100);
  };
  
  // Find habit with the most completions
  const habitWithMostCompletions = habits.reduce((max, habit) => {
    const completions = calculateTotalCompletions(habit);
    return completions > calculateTotalCompletions(max) ? habit : max;
  }, habits[0]);
  
  // Find habit with the longest streak
  const habitWithLongestStreak = habits.reduce((max, habit) => {
    const streak = calculateLongestStreak(habit);
    return streak > calculateLongestStreak(max) ? habit : max;
  }, habits[0]);
  
  // Find habit with the highest monthly rate
  const habitWithHighestMonthlyRate = habits.reduce((max, habit) => {
    const rate = calculateMonthlyRate(habit);
    return rate > calculateMonthlyRate(max) ? habit : max;
  }, habits[0]);
  
  // Calculate overall completion rate for all habits
  const calculateOverallRate = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysElapsed = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    
    let totalCompletions = 0;
    let totalPossibleCompletions = daysElapsed * habits.length;
    
    habits.forEach(habit => {
      Object.keys(habit.trackedDays).forEach(dateKey => {
        const date = new Date(dateKey);
        if (date.getFullYear() === today.getFullYear() && date <= today) {
          totalCompletions++;
        }
      });
    });
    
    return Math.round((totalCompletions / totalPossibleCompletions) * 100);
  };
  
  return (
    <div className="summary-report">
      <h3>Summary Report</h3>
      <div className="summary-stats">
        <div className="summary-stat-card">
          <span className="summary-stat-label">Total Habits</span>
          <span className="summary-stat-value">{habits.length}</span>
        </div>
        
        <div className="summary-stat-card">
          <span className="summary-stat-label">Overall Completion</span>
          <span className="summary-stat-value">{calculateOverallRate()}%</span>
        </div>
        
        <div className="summary-stat-card">
          <span className="summary-stat-label">Most Consistent</span>
          <span className="summary-stat-value">
            {habitWithHighestMonthlyRate.name}
            <span className="summary-stat-subtext">
              {calculateMonthlyRate(habitWithHighestMonthlyRate)}% this month
            </span>
          </span>
        </div>
        
        <div className="summary-stat-card">
          <span className="summary-stat-label">Longest Streak</span>
          <span className="summary-stat-value">
            {calculateLongestStreak(habitWithLongestStreak)} days
            <span className="summary-stat-subtext">
              {habitWithLongestStreak.name}
            </span>
          </span>
        </div>
        
        <div className="summary-stat-card">
          <span className="summary-stat-label">Most Completions</span>
          <span className="summary-stat-value">
            {calculateTotalCompletions(habitWithMostCompletions)} days
            <span className="summary-stat-subtext">
              {habitWithMostCompletions.name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;