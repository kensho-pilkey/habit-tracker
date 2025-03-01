import React, { useState, useEffect } from 'react';
import './HabitGrid.css';

const HabitGrid = ({ habit, onToggleDay }) => {
  // State to store all days for the grid
  const [gridCells, setGridCells] = useState([]);
  // State for current view mode (year, month, week)
  const [viewMode, setViewMode] = useState('month');
  
  // Generate grid based on selected view mode
  useEffect(() => {
    if (habit) {
      generateGrid(viewMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit, viewMode]);
  
  // Function to generate grid data based on view mode
  const generateGrid = (mode) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const cells = [];
    
    let startDate, endDate;
    
    switch (mode) {
      case 'week':
        // Start from the beginning of the current week (Sunday)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        // End at the end of the current week (Saturday)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      
      case 'month':
        // Start from the beginning of the current month
        startDate = new Date(currentYear, today.getMonth(), 1);
        // End at the end of the current month
        endDate = new Date(currentYear, today.getMonth() + 1, 0);
        break;
      
      case 'year':
      default:
        // Start from January 1st of current year
        startDate = new Date(currentYear, 0, 1);
        // End at December 31st of current year
        endDate = new Date(currentYear, 11, 31);
        break;
    }
    
    // Loop through each day in the selected range
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
  
  // Get week days information for the week view
  const getWeekViewData = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    // Find all cells belonging to the current week
    const weekCells = gridCells.filter(cell => {
      const cellDate = cell.date;
      const cellWeekStart = new Date(cellDate);
      cellWeekStart.setDate(cellDate.getDate() - cellDate.getDay());
      return cellWeekStart.toDateString() === weekStart.toDateString();
    });
    
    // Create day columns with required data
    const dayColumns = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      
      const matchingCell = weekCells.find(cell => cell.dayOfWeek === i);
      
      dayColumns.push({
        dayOfWeek: i,
        dayLabel: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: dayDate.getDate(),
        dateKey: formatDateKey(dayDate),
        cell: matchingCell || null
      });
    }
    
    return dayColumns;
  };
  
  // Month names for labels
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Get the title for the current view
  const getViewTitle = () => {
    const today = new Date();
    
    switch (viewMode) {
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      case 'month':
        return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      case 'year':
      default:
        return `${today.getFullYear()}`;
    }
  };
  
  // Organize cells differently based on view mode
  let weeks = {};
  let monthGrid = [];
  
  if (viewMode === 'year') {
    // Year view: organize by week number for the GitHub-style grid
    gridCells.forEach(cell => {
      if (!weeks[cell.weekNumber]) {
        weeks[cell.weekNumber] = Array(7).fill(null);
      }
      weeks[cell.weekNumber][cell.dayOfWeek] = cell;
    });
  } 
  else if (viewMode === 'month') {
    // Month view: organize in a calendar-style grid
    // Find the first day of the month and determine its day of week
    const firstDayOfMonth = gridCells.find(cell => cell.date.getDate() === 1);
    const firstDayOfWeek = firstDayOfMonth ? firstDayOfMonth.dayOfWeek : 0;
    
    // Create week rows for the month
    let currentWeek = Array(7).fill(null);
    let dayCounter = 0;
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek[i] = null;
      dayCounter++;
    }
    
    // Add all days of the month
    gridCells.forEach(cell => {
      const dayOfWeek = cell.dayOfWeek;
      
      if (dayCounter % 7 === 0 && dayCounter > 0) {
        monthGrid.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
      
      currentWeek[dayOfWeek] = cell;
      dayCounter++;
    });
    
    // Add the last week if not already added
    if (currentWeek.some(cell => cell !== null)) {
      monthGrid.push(currentWeek);
    }
  }
  
  // Get week view data safely
  const weekViewData = viewMode === 'week' ? getWeekViewData() : [];
  
  // Get month labels with their positions (only for year view)
  const monthLabels = [];
  if (viewMode === 'year') {
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
  }
  
  if (!habit) {
    return <div className="habit-grid-empty">Select a habit to view its grid</div>;
  }
  
  return (
    <div className="habit-grid-container">
      <div className="habit-grid-header">
        <h3>{habit.name} - {getViewTitle()}</h3>
        
        <div className="view-toggle">
          <button 
            className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button 
            className={`view-button ${viewMode === 'year' ? 'active' : ''}`}
            onClick={() => setViewMode('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="habit-grid">
        {viewMode === 'year' && (
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
        )}
        
        {/* Display based on view mode */}
        {viewMode === 'year' && (
          <div className="grid-content year-view">
            <div className="day-labels vertical">
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
                      className={`grid-cell year ${cell ? (cell.isCompleted ? 'completed' : 'empty') : 'outside'} ${cell && !cell.isPast ? 'future' : ''}`}
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
        )}
        
        {viewMode === 'month' && (
          <div className="grid-content month-view">
            <table className="month-calendar">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>
                {monthGrid.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((cell, dayIndex) => (
                      <td key={dayIndex}>
                        {cell && (
                          <div 
                            className={`calendar-cell ${cell.isCompleted ? 'completed' : 'empty'} ${!cell.isPast ? 'future' : ''}`}
                            style={{ 
                              backgroundColor: cell.isCompleted ? habit.color : '#ebedf0',
                              opacity: cell.isPast ? (cell.isCompleted ? 1 : 0.3) : 0.1
                            }}
                            onClick={() => handleCellClick(cell.dateKey, cell.isPast)}
                            title={`${formatDateForTooltip(cell.date)}: ${cell.isCompleted ? 'Completed' : 'Not completed'}`}
                          >
                            <span className="date-number">{cell.date.getDate()}</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {viewMode === 'week' && (
          <div className="grid-content week-view">
            <div className="week-container">
              {weekViewData.map((dayData, index) => (
                <div key={index} className="week-day-column">
                  <div className="week-day-label">{dayData.dayLabel}</div>
                  <div className="week-date-label">{dayData.dateNum}</div>
                  {dayData.cell ? (
                    <div 
                      className={`week-cell ${dayData.cell.isCompleted ? 'completed' : 'empty'} ${!dayData.cell.isPast ? 'future' : ''}`}
                      style={{ 
                        backgroundColor: dayData.cell.isCompleted ? habit.color : '#ebedf0',
                        opacity: dayData.cell.isPast ? (dayData.cell.isCompleted ? 1 : 0.3) : 0.1
                      }}
                      onClick={() => handleCellClick(dayData.cell.dateKey, dayData.cell.isPast)}
                      title={`${formatDateForTooltip(dayData.cell.date)}: ${dayData.cell.isCompleted ? 'Completed' : 'Not completed'}`}
                    ></div>
                  ) : (
                    <div 
                      className="week-cell empty"
                      style={{ 
                        backgroundColor: '#ebedf0',
                        opacity: 0.3
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
    </div>
  );
};

export default HabitGrid;