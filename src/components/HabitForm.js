import React, { useState, useEffect } from 'react';
import './HabitForm.css';

const HabitForm = ({ onSubmit, habit, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    color: '#4CAF50'
  });
  
  // Available colors for habits
  const colorOptions = [
    { name: 'Green', value: '#4CAF50' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Red', value: '#F44336' },
    { name: 'Teal', value: '#009688' }
  ];
  
  // Update form when habit prop changes (for editing)
  useEffect(() => {
    if (habit) {
      setFormData({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        color: habit.color
      });
    } else {
      // Reset form for new habit
      setFormData({
        id: null,
        name: '',
        description: '',
        color: '#4CAF50'
      });
    }
  }, [habit]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    
    // Pass form data to parent component
    onSubmit({
      ...formData,
      trackedDays: habit ? habit.trackedDays : {}
    });
    
    // Reset form if not editing
    if (!habit) {
      setFormData({
        id: null,
        name: '',
        description: '',
        color: '#4CAF50'
      });
    }
  };
  
  return (
    <div className="habit-form-container">
      <h3>{habit ? 'Edit Habit' : 'Add New Habit'}</h3>
      
      <form onSubmit={handleSubmit} className="habit-form">
        <div className="form-group">
          <label htmlFor="habitName">Habit Name:</label>
          <input
            type="text"
            id="habitName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Exercise, Reading, Meditation"
            maxLength="50"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="habitDescription">Description (optional):</label>
          <textarea
            id="habitDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of your habit"
            maxLength="200"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Color:</label>
          <div className="color-options">
            {colorOptions.map(color => (
              <div 
                key={color.value} 
                className={`color-option ${formData.color === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setFormData({ ...formData, color: color.value })}
                title={color.name}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {habit ? 'Update Habit' : 'Add Habit'}
          </button>
          
          {habit && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HabitForm;