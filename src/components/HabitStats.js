import React, { useEffect, useState} from 'react';
import './HabitStats.css';

const HabitStats = ({ habit }) => {

  const [quote, setQuote] = useState({ content: "", author: "" });
  const [quoteLoading, setQuoteLoading] = useState(true);
  

  useEffect(() => {
    const getRandomQuote = () => {
      // Collection of motivational and habit-related quotes
      const quotes = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { content: "Quality is not an act, it is a habit.", author: "Aristotle" },
        { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { content: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
        { content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
        { content: "Habits are first cobwebs, then cables.", author: "Spanish Proverb" },
        { content: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
        { content: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
        { content: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.", author: "Benjamin Franklin" },
        { content: "Good habits formed at youth make all the difference.", author: "Aristotle" },
        { content: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
        { content: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
        { content: "Champions keep playing until they get it right.", author: "Billie Jean King" },
        { content: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.", author: "John C. Maxwell" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { content: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
        { content: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
        { content: "A year from now you may wish you had started today.", author: "Karen Lamb" },
        { content: "Your daily choices determine your destiny.", author: "Unknown" },
        { content: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
        { content: "The habit of persistence is the habit of victory.", author: "Herbert Kaufman" },
        { content: "We first make our habits, and then our habits make us.", author: "John Dryden" },
        { content: "Make each day your masterpiece.", author: "John Wooden" },
        { content: "The only limit to your impact is your imagination and commitment.", author: "Tony Robbins" },
        { content: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
        { content: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
        { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { content: "Habits are the compound interest of self-improvement.", author: "James Clear" },
        { content: "Success doesn't come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" }
      ];
      
      // Return a random quote from the collection
      return quotes[Math.floor(Math.random() * quotes.length)];
    };
  
    // Set a new random quote whenever the habit changes
    if (habit && habit.id) {
      setQuoteLoading(true);
      // Short timeout to show loading state (optional)
      setTimeout(() => {
        setQuote(getRandomQuote());
        setQuoteLoading(false);
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit?.id]);

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
      <div className="quote-container">
        <h4>Quote of the Day</h4>
        {quoteLoading ? (
          <div className="quote-loading">Loading inspiration...</div>
        ) : (
          <div className="quote">
            <p className="quote-content">"{quote.content}"</p>
            <p className="quote-author">— {quote.author}</p>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default HabitStats;