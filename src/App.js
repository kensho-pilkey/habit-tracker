import React, { useState, useEffect } from 'react';
import './App.css';
import HabitGrid from './components/HabitGrid';
import HabitForm from './components/HabitForm';

function App() {
  // Load habits from localStorage if available, otherwise use initial data
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [{
      id: 1,
      name: "Daily Exercise",
      description: "30 minutes of exercise each day",
      color: "#4CAF50",
      trackedDays: {
        "2025-03-01": true,
        "2025-02-28": true,
        "2025-02-27": true,
        "2025-02-25": true,
        "2025-02-20": true,
        "2025-02-19": true,
        "2025-02-18": true,
        "2025-01-15": true,
        "2025-01-14": true,
      }
    }];
  });
  
  // State for selected habit (for editing and viewing grid)
  const [selectedHabit, setSelectedHabit] = useState(() => {
    return habits[0] || null;
  });
  
  // State to track which habit we're editing (if any)
  const [editingHabit, setEditingHabit] = useState(null);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Add a new habit
  const handleAddHabit = (newHabit) => {
    // Create new habit with ID and empty trackedDays
    const habitToAdd = {
      ...newHabit,
      id: Date.now(), // Simple unique ID generation
      trackedDays: newHabit.trackedDays || {}
    };
    
    setHabits([...habits, habitToAdd]);
    setSelectedHabit(habitToAdd); // Select the newly added habit
  };
  
  // Update an existing habit
  const handleUpdateHabit = (updatedHabit) => {
    setHabits(
      habits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
    setSelectedHabit(updatedHabit);
    setEditingHabit(null); // Exit edit mode
  };

  // Delete a habit
  const handleDeleteHabit = (habitId) => {
    // Filter out the habit with the given ID
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
    
    // If we're deleting the currently selected habit, select another one
    if (selectedHabit && selectedHabit.id === habitId) {
      setSelectedHabit(updatedHabits[0] || null);
    }
    
    // If we're deleting the habit being edited, exit edit mode
    if (editingHabit && editingHabit.id === habitId) {
      setEditingHabit(null);
    }
  };
  
  // Toggle a day for a habit (completed/not completed)
  const handleToggleDay = (habitId, dateKey) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedTrackedDays = { ...habit.trackedDays };
        
        if (updatedTrackedDays[dateKey]) {
          delete updatedTrackedDays[dateKey]; // Remove if already tracked
        } else {
          updatedTrackedDays[dateKey] = true; // Add if not tracked
        }
        
        const updatedHabit = { 
          ...habit, 
          trackedDays: updatedTrackedDays 
        };
        
        // Also update selectedHabit if this is the one being modified
        if (selectedHabit && selectedHabit.id === habitId) {
          setSelectedHabit(updatedHabit);
        }
        
        // Also update editingHabit if this is the one being edited
        if (editingHabit && editingHabit.id === habitId) {
          setEditingHabit(updatedHabit);
        }
        
        return updatedHabit;
      }
      return habit;
    });
    
    setHabits(updatedHabits);
  };

  // Handle form submission (add or update)
  const handleSubmitForm = (habitData) => {
    if (habitData.id) {
      handleUpdateHabit(habitData);
    } else {
      handleAddHabit(habitData);
    }
  };
  
  // Start editing a habit
  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingHabit(null);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Habit Tracker</h1>
        <p>Track your daily habits and build streaks!</p>
      </header>
      
      <main className="App-main">
        <div className="app-layout">
          <div className="form-container">
            <HabitForm 
              onSubmit={handleSubmitForm}
              habit={editingHabit} // Pass the habit being edited, or null
              onCancel={handleCancelEdit}
            />
            
            <div className="habits-list">
              <h3>My Habits</h3>
              {habits.length === 0 ? (
                <p className="no-habits">No habits added yet. Add your first habit above!</p>
              ) : (
                habits.map(habit => (
                  <div 
                    key={habit.id}
                    className={`habit-item ${selectedHabit && selectedHabit.id === habit.id ? 'selected' : ''}`}
                    onClick={() => setSelectedHabit(habit)}
                  >
                    <div 
                      className="habit-color" 
                      style={{ backgroundColor: habit.color }}
                    ></div>
                    <div className="habit-name">{habit.name}</div>
                    
                    {/* Action buttons for selected habit */}
                    {selectedHabit && selectedHabit.id === habit.id && (
                      <div className="habit-actions">
                        <button 
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditHabit(habit);
                          }}
                          title="Edit habit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this habit?')) {
                              handleDeleteHabit(habit.id);
                            }
                          }}
                          title="Delete habit"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid-container">
            {selectedHabit ? (
              <HabitGrid 
                habit={selectedHabit}
                onToggleDay={handleToggleDay}
              />
            ) : (
              <div className="select-habit-message">
                Select a habit to view its grid
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;