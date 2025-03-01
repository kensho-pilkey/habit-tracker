import React, { useState, useEffect } from 'react';
import './HabitGrid.css';

const HabitGrid = ({ habit, onToggleDay }) => {
  // State to store all days for the grid
  const [gridCells, setGridCells] = useState([]);
  
  // Generate all days for the year
  useEffect(() => {
    const generateYearGrid = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const cells = [];
      
      // Start from January 1st of current year
      const startDate = new Date(currentYear, 0, 1);
      // End at December 31st of current year
      const endDate = new Date(currentYear, 11, 31);
      
      // Loop through each day of the year
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ...
        const weekNumber = getWeekNumber(d);
        const month = d.getMonth(); // 0-11
        const isFirstOfMonth = d.getDate() === 1;
        
        cells.push({
          date: new Date(d),
          dateKey,
          dayOfWeek,
          weekNumber,
          month,
          isFirstOfMonth,
          isCompleted: habit.trackedDays[dateKey] || false,
          isPast: d <= today // Flag to indicate if the date is in the past or future
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
  const handleCellClick = (dateKey, isPast) => {
    // Only allow toggling past dates (up to today)
    if (isPast && onToggleDay) {
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
  
  // Month names for labels
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Organize cells by week for the grid layout
  const weeks = {};
  gridCells.forEach(cell => {
    if (!weeks[cell.weekNumber]) {
      weeks[cell.weekNumber] = Array(7).fill(null);
    }
    weeks[cell.weekNumber][cell.dayOfWeek] = cell;
  });
  
  // Get month labels with their positions
  const monthLabels = [];
  let currentMonth = -1;
  
  Object.keys(weeks).forEach(weekNum => {
    weeks[weekNum].forEach(cell => {
      if (cell && cell.isFirstOfMonth) {
        monthLabels.push({
          month: cell.month,
          weekNum: cell.weekNumber
        });
      }
    });
  });
  
  if (!habit) {
    return <div className="habit-grid-empty">Select a habit to view its grid</div>;
  }
  
  return (
    <div className="habit-grid-container">
      <h3>{habit.name} - Progress Grid</h3>
      
      <div className="habit-grid">
        <div className="month-labels">
          {monthLabels.map(label => (
            <div 
              key={label.month} 
              className="month-label"
              style={{ 
                gridColumn: parseInt(label.weekNum) + 1 // +1 for the day labels column
              }}
            >
              {monthNames[label.month]}
            </div>
          ))}
        </div>
        
        <div className="grid-content">
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
                    className={`grid-cell ${cell ? (cell.isCompleted ? 'completed' : 'empty') : 'outside'} ${cell && !cell.isPast ? 'future' : ''}`}
                    style={{ 
                      backgroundColor: cell && cell.isCompleted ? habit.color : '#ebedf0',
                      opacity: cell ? (cell.isPast ? (cell.isCompleted ? 1 : 0.3) : 0.1) : 0
                    }}
                    onClick={() => cell && handleCellClick(cell.dateKey, cell.isPast)}
                    title={cell ? `${formatDateForTooltip(cell.date)}: ${cell.isCompleted ? 'Completed' : 'Not completed'}` : ''}
                  ></div>
                ))}
              </div>
            ))}
          </div>
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
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ebedf0', opacity: 0.1 }}></div>
          <span>Future Date</span>
        </div>
      </div>
      
      <div className="stats">
        <p>Current streak: {calculateCurrentStreak()} days</p>
        <p>Longest streak: {calculateLongestStreak()} days</p>
        <p>Completion rate: {calculateCompletionRate()}%</p>
      </div>
    </div>
  );
  
  // Helper functions for statistics
  function calculateCurrentStreak() {
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
  }
  
  function calculateLongestStreak() {
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
  }
  
  function calculateCompletionRate() {
    if (!habit || !habit.trackedDays) return 0;
    
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysElapsed = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    
    const completedDays = Object.keys(habit.trackedDays).filter(dateKey => {
      const date = new Date(dateKey);
      return date.getFullYear() === today.getFullYear() && date <= today;
    }).length;
    
    return Math.round((completedDays / daysElapsed) * 100);
  }
};

export default HabitGrid;