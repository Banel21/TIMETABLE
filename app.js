document.addEventListener('DOMContentLoaded', () => {
  // Notification setup
  const enableNotificationsBtn = document.getElementById('enableNotifications');
  let notificationInterval;
  let currentBlock = null;
  
  const schedule = [
    { time: '09:00', id: 'block1', title: '⏰ Java Time!', message: 'Start your Java Core Concepts session (09:00-10:30)' },
    { time: '10:30', id: 'block2', title: '⏰ Java Continues!', message: 'Continue with Java Frameworks (10:30-12:00)' },
    { time: '12:00', id: 'break1', title: '☕ Break Time!', message: 'Take a 30-minute morning break (12:00-12:30)' },
    { time: '12:30', id: 'block3', title: '⏰ JavaScript Time!', message: 'Start JavaScript Fundamentals (12:30-14:00)' },
    { time: '14:00', id: 'block4', title: '⏰ Advanced JS!', message: 'Continue with Advanced JavaScript (14:00-15:30)' },
    { time: '15:30', id: 'break2', title: '🍽️ Lunch Time!', message: 'Take a 30-minute lunch break (15:30-16:00)' },
    { time: '16:00', id: 'block5', title: '⏰ Database Time!', message: 'Study SQL Server & MongoDB (16:00-17:30)' },
    { time: '17:30', id: 'block6', title: '📚 Reading Time!', message: 'Java Book & English Reading (17:30-19:00)' },
    { time: '19:00', id: 'break3', title: '🚶‍♂️ Break Time!', message: 'Take a 30-minute evening break (19:00-19:30)' },
    { time: '19:30', id: 'block7', title: '💻 Project Time!', message: 'Work on your Full Stack Project (19:30-21:00)' }
  ];

  // Request notification permission
  if (enableNotificationsBtn) {
    enableNotificationsBtn.addEventListener('click', () => {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notifications');
        return;
      }

      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled! You will receive reminders for study sessions and breaks.');
          startNotificationSchedule();
          enableNotificationsBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Enabled';
          enableNotificationsBtn.classList.add('enabled');
        } else {
          alert('Notifications blocked. You can enable them in browser settings.');
        }
      });
    });
  }

  // Start notification schedule
  function startNotificationSchedule() {
    checkSchedule(); // Immediate check
    notificationInterval = setInterval(checkSchedule, 60000); // Check every minute
  }

  // Check current time against schedule
  function checkSchedule() {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    const currentEvent = schedule.find(event => event.time === currentTime);
    
    if (currentEvent && (!currentBlock || currentBlock.id !== currentEvent.id)) {
      currentBlock = currentEvent;
      sendNotification(currentEvent.title, currentEvent.message);
      highlightCurrentBlock(currentEvent.id);
    }
  }

  // Send notification
  function sendNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body: message,
        icon: 'icons/icon-192.png',
        vibrate: [200, 100, 200]
      });
      
      // Play sound if available
      if (typeof Audio !== 'undefined') {
        const sound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        sound.play().catch(e => console.log('Audio playback failed:', e));
      }
    }
  }

  // Highlight current block in the table
  function highlightCurrentBlock(blockId) {
    document.querySelectorAll('.study-block, .break-row').forEach(row => {
      row.classList.remove('current-time');
    });
    
    const currentElement = document.getElementById(blockId);
    if (currentElement) {
      currentElement.classList.add('current-time');
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  // Initial check when page loads
  checkSchedule();
});