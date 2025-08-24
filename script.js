// Material Design 3 Dark Theme Mobile App JavaScript

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Update status bar time
    updateStatusBarTime();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize buttons with ripple effect
    initializeButtons();
    
    // Initialize progress animation
    animateProgress();
    
    // Initialize timer
    initializeTimer();
    
    // Initialize activity updates
    simulateActivityUpdates();
    
    // Add touch interactions
    addTouchInteractions();
}

// Update status bar time
function updateStatusBarTime() {
    const timeElement = document.querySelector('.time');
    
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Initialize bottom navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Add haptic feedback simulation
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            // Animate the transition
            animatePageTransition(item.querySelector('span').textContent);
        });
    });
}

// Initialize button interactions
function initializeButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate button action
            handleButtonAction(this);
        });
    });
}

// Handle button actions
function handleButtonAction(button) {
    const buttonText = button.textContent.trim();
    
    if (buttonText.includes('КУПИТЬ')) {
        showNotification('Покупка в процессе...', 'info');
        simulatePurchase();
    } else if (buttonText.includes('ЗАРАБОТАТЬ')) {
        showNotification('Открываем возможности заработка...', 'success');
        simulateEarning();
    }
}

// Animate progress bar
function animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    let currentProgress = 65;
    
    // Simulate progress updates
    setInterval(() => {
        currentProgress += Math.random() * 2 - 0.5; // Random fluctuation
        currentProgress = Math.max(0, Math.min(100, currentProgress));
        progressFill.style.width = `${currentProgress}%`;
        
        // Update the big number based on progress
        updateBigNumber(currentProgress);
    }, 3000);
}

// Update big number display
function updateBigNumber(progress) {
    const bigNumber = document.querySelector('.big-number');
    const value = (progress * 1.5).toFixed(3);
    
    // Animate number change
    animateValue(bigNumber, parseFloat(bigNumber.textContent), parseFloat(value), 500);
}

// Animate value change
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        element.textContent = current.toFixed(3);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize countdown timer
function initializeTimer() {
    const timerElement = document.querySelector('.timer span');
    let timeRemaining = 86387; // Initial time in seconds (23:59:47)
    
    function updateTimer() {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeRemaining--;
        
        if (timeRemaining < 0) {
            timeRemaining = 86400; // Reset to 24 hours
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Simulate activity updates
function simulateActivityUpdates() {
    const activities = [
        { icon: 'arrow_upward', title: 'Новая покупка', amount: '+75.00', type: 'positive' },
        { icon: 'arrow_downward', title: 'Вывод завершен', amount: '-100.00', type: 'negative' },
        { icon: 'swap_horiz', title: 'Обмен выполнен', amount: '250.00', type: 'neutral' },
        { icon: 'star', title: 'Бонус получен', amount: '+10.00', type: 'positive' },
        { icon: 'trending_up', title: 'Рост портфеля', amount: '+5.5%', type: 'positive' }
    ];
    
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addNewActivity(randomActivity);
    }, 15000); // Add new activity every 15 seconds
}

// Add new activity to the list
function addNewActivity(activity) {
    const activityList = document.querySelector('.activity-list');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    
    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="material-icons">${activity.icon}</i>
        </div>
        <div class="activity-content">
            <span class="activity-title">${activity.title}</span>
            <span class="activity-time">Только что</span>
        </div>
        <div class="activity-amount ${activity.type}">${activity.amount}</div>
    `;
    
    // Add to the beginning of the list
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Animate in
    setTimeout(() => {
        activityItem.style.transition = 'opacity 0.3s ease';
        activityItem.style.opacity = '1';
    }, 10);
    
    // Remove last item if list is too long
    if (activityList.children.length > 5) {
        const lastItem = activityList.lastChild;
        lastItem.style.opacity = '0';
        setTimeout(() => {
            lastItem.remove();
        }, 300);
    }
    
    // Update time for other activities
    updateActivityTimes();
}

// Update activity times
function updateActivityTimes() {
    const activities = document.querySelectorAll('.activity-item');
    const timeTexts = ['Только что', '1 минуту назад', '5 минут назад', '15 минут назад', '30 минут назад'];
    
    activities.forEach((activity, index) => {
        if (index > 0 && index < timeTexts.length) {
            const timeElement = activity.querySelector('.activity-time');
            if (timeElement) {
                timeElement.textContent = timeTexts[index];
            }
        }
    });
}

// Add touch interactions
function addTouchInteractions() {
    const cards = document.querySelectorAll('.small-card, .activity-item');
    
    cards.forEach(card => {
        let touchStartY = 0;
        let touchStartX = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            card.style.transition = 'none';
        });
        
        card.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchY - touchStartY;
            const deltaX = touchX - touchStartX;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                card.style.transform = `translateX(${deltaX * 0.3}px)`;
            }
        });
        
        card.addEventListener('touchend', () => {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'translateX(0)';
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#03DAC6' : type === 'error' ? '#CF6679' : '#BB86FC'};
        color: #121212;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Simulate purchase process
function simulatePurchase() {
    const bigNumber = document.querySelector('.big-number');
    const currentValue = parseFloat(bigNumber.textContent);
    
    setTimeout(() => {
        animateValue(bigNumber, currentValue, currentValue + 10, 1000);
        showNotification('Покупка успешно завершена!', 'success');
        
        // Add purchase to activity
        addNewActivity({
            icon: 'shopping_cart',
            title: 'Покупка завершена',
            amount: '+10.00',
            type: 'positive'
        });
    }, 2000);
}

// Simulate earning process
function simulateEarning() {
    const stats = document.querySelectorAll('.stat-value');
    
    setTimeout(() => {
        // Update follower count
        const followers = stats[0];
        const currentFollowers = parseInt(followers.textContent);
        animateValue(followers, currentFollowers, currentFollowers + 5, 500);
        
        showNotification('Начислены бонусы за активность!', 'success');
        
        // Add earning to activity
        addNewActivity({
            icon: 'attach_money',
            title: 'Заработок начислен',
            amount: '+25.00',
            type: 'positive'
        });
    }, 1500);
}

// Animate page transition
function animatePageTransition(pageName) {
    const appContainer = document.querySelector('.app-container');
    
    appContainer.style.opacity = '0.5';
    appContainer.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        appContainer.style.transition = 'all 0.3s ease';
        appContainer.style.opacity = '1';
        appContainer.style.transform = 'scale(1)';
        
        showNotification(`Переход на ${pageName}`, 'info');
    }, 200);
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add pull-to-refresh functionality
let pullToRefreshStartY = 0;
let isPulling = false;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        pullToRefreshStartY = e.touches[0].clientY;
        isPulling = true;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isPulling) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - pullToRefreshStartY;
        
        if (pullDistance > 0 && pullDistance < 150) {
            document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
        }
    }
});

document.addEventListener('touchend', () => {
    if (isPulling) {
        document.body.style.transition = 'transform 0.3s ease';
        document.body.style.transform = 'translateY(0)';
        
        const pullDistance = parseInt(document.body.style.transform.replace(/[^0-9]/g, '')) || 0;
        
        if (pullDistance > 50) {
            showNotification('Обновление данных...', 'info');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
        
        isPulling = false;
    }
});

// Performance optimization - lazy loading for images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    const navItems = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');
    const activeIndex = Array.from(navItems).indexOf(activeItem);
    
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
        navItems[activeIndex - 1].click();
    } else if (e.key === 'ArrowRight' && activeIndex < navItems.length - 1) {
        navItems[activeIndex + 1].click();
    }
});

console.log('Material Design 3 Dark Theme App initialized successfully!');