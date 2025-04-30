function markAsRead() {
  const select = document.getElementById('planSelect');
  const value = select.value;
  const list = document.getElementById('completedList');
  const li = document.createElement('li');
  li.textContent = `${value} – ${new Date().toLocaleDateString()}`;
  list.appendChild(li);
}
