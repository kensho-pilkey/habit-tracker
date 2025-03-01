import React, { useState, useEffect } from 'react';
import './HabitGrid.css';

const HabitGrid = ({ habit, onToggleDay }) => {
  // State to store all days for the grid
  const [gridCells, setGridCells] = useState([]);
  
  // Generate all days for the year (365/366 days)
  useEffect(() => {
    const generateYearGrid = () => {
      const today = new Date();
      const cells = [];
      
      // Go back to start of year or at most 365 days back
      const startDate = new Date(today.getFullYear(), 0, 1); // Jan 1st of current year
      
      // Loop through each day from start date to today
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ...
        const weekNumber = getWeekNumber(d);
        
        cells.push({
          date: new Date(d),
          dateKey,
          dayOfWeek,
          weekNumber,
          isCompleted: habit?.trackedDays?.[dateKey] || false
        });
      }
      
      setGridCells(cells);
    };
    
    if (habit) {
      generateYearGrid();
    }
  }, [habit]);
  
  // Format date as YYYY-MM-DD
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get week number (0-51) for positioning
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.floor((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  // Handle click on a day cell
  const handleCellClick = (dateKey) => {
    if (onToggleDay) {
      onToggleDay(habit.id, dateKey);
    }
  };
  
  // Format date for the tooltip
  const formatDateForTooltip = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Organize cells by week for the grid layout
  const weeks = {};
  gridCells.forEach(cell => {
    if (!weeks[cell.weekNumber]) {
      weeks[cell.weekNumber] = Array(7).fill(null);
    }
    weeks[cell.weekNumber][cell.dayOfWeek] = cell;
  });
  
  // Calculate statistics
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
  
  const calculateCompletionRate = () => {
    if (!habit || !habit.trackedDays || gridCells.length === 0) return 0;
    
    const completedDays = Object.keys(habit.trackedDays).length;
    return Math.round((completedDays / gridCells.length) * 100);
  };
  
  if (!habit) {
    return <div className="habit-grid-empty">Select a habit to view its grid</div>;
  }
  
  return (
    <div className="habit-grid-container">
      <h3>{habit.name} - Progress Grid</h3>
      
      <div className="habit-grid">
        <div className="day-labels">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="grid-weeks">
          {Object.keys(weeks).map(weekNum => (
            <div key={weekNum} className="grid-week">
              {weeks[weekNum].map((cell, dayIndex) => (
                <div 
                  key={dayIndex}
                  className={`grid-cell ${cell ? (cell.isCompleted ? 'completed' : 'empty') : 'outside'}`}
                  style={{ 
                    backgroundColor: cell && cell.isCompleted ? habit.color : '#ebedf0',
                    opacity: cell && cell.isCompleted ? 1 : 0.3
                  }}
                  onClick={() => cell && handleCellClick(cell.dateKey)}
                  title={cell ? `${formatDateForTooltip(cell.date)}: ${cell.isCompleted ? 'Completed' : 'Not completed'}` : ''}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: habit.color, opacity: 0.3 }}></div>
          <span>Not Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: habit.color }}></div>
          <span>Completed</span>
        </div>
      </div>
      
      <div className="stats">
        <p>Current streak: {calculateCurrentStreak()} days</p>
        <p>Longest streak: {calculateLongestStreak()} days</p>
        <p>Completion rate: {calculateCompletionRate()}%</p>
      </div>
    </div>
  );
};

export default HabitGrid;