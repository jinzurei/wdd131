// Review counter - tracks how many reviews submitted

const countKey = 'reviewCount';
let count = localStorage.getItem(countKey);
count = count ? parseInt(count, 10) + 1 : 1;
localStorage.setItem(countKey, count);
document.getElementById('review-count').textContent = `You have submitted ${count} review${count > 1 ? 's' : ''}.`;
