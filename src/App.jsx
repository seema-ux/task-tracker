import { useState, useMemo, useEffect } from 'react';
import { STORAGE_KEY, DAY_KEYS, TODAY_INDEX } from './constants.js';
import DayCheckboxes from './DayCheckboxes.jsx';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';

function emptyDays() {
  return DAY_KEYS.reduce((acc, d) => ({ ...acc, [d]: false }), {});
}

function buildSeedTasks() {
  const seedTasks = [
    { id: 1, title: 'Morning workout 🏃‍♀️', days: emptyDays() },
    { id: 2, title: 'Read 20 pages 📖', days: emptyDays() },
    { id: 3, title: 'Drink 8 glasses of water 💧', days: emptyDays() },
    { id: 4, title: 'Journal before bed ✨', days: emptyDays() },
  ];
  [1, 2, 3, 4, 5, 6, 12, 13, 14, 20, 21].forEach(d => { seedTasks[0].days[d] = true; });
  [1, 2, 8, 9, 21].forEach(d => { seedTasks[1].days[d] = true; });
  [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21].forEach(d => { seedTasks[2].days[d] = true; });
  [21].forEach(d => { seedTasks[3].days[d] = true; });
  return seedTasks;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return buildSeedTasks();
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [title, setTitle] = useState('');
  const [tab, setTab] = useState('remaining');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) {}
  }, [tasks]);

  function addTask() {
    if (!title.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), title: title.trim(), days: emptyDays() }]);
    setTitle('');
  }

  function toggleDay(id, day) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, days: { ...t.days, [day]: !t.days[day] } } : t
    ));
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  const completedToday = tasks.filter(t => t.days[TODAY_INDEX]);
  const remainingToday = tasks.filter(t => !t.days[TODAY_INDEX]);

  const barData = useMemo(() => DAY_KEYS.map(d => tasks.filter(t => t.days[d]).length), [tasks]);

  const progressLabel = (t) => {
    const doneCount = DAY_KEYS.filter(d => t.days[d]).length;
    return `${doneCount}/30 days`;
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title-block">
          <h1>🌸 Task Tracker</h1>
          <p>A 30-day check-off tracker for your little habits.</p>
        </div>
        <div className="stat-row">
          <div className="stat pink"><span className="num">{tasks.length}</span><span className="lbl">tasks</span></div>
          <div className="stat mint"><span className="num">{completedToday.length}</span><span className="lbl">done today</span></div>
          <div className="stat lav"><span className="num">{remainingToday.length}</span><span className="lbl">remaining</span></div>
        </div>
      </div>

      <div className="panel">
        <h2>✨ Add a task</h2>
        <div className="add-row">
          <input
            type="text"
            placeholder="e.g. Water the plants"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
          />
          <button onClick={addTask} disabled={!title.trim()}>Add</button>
        </div>

        <div className="task-scroll">
          {tasks.map(t => (
            <div className="task-row" key={t.id}>
              <div className="task-row-top">
                <p>{t.title}</p>
                <span className="progress-chip">{progressLabel(t)}</span>
                <button className="del" onClick={() => removeTask(t.id)} title="Delete">×</button>
              </div>
              <DayCheckboxes task={t} onToggle={toggleDay} />
            </div>
          ))}
          {tasks.length === 0 && <div className="empty-tab">No tasks yet — add one above 🌼</div>}
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === 'remaining' ? 'active remaining-active' : ''}
          onClick={() => setTab('remaining')}
        >Remaining today<span className="n">{remainingToday.length}</span></button>
        <button
          className={tab === 'completed' ? 'active' : ''}
          onClick={() => setTab('completed')}
        >Completed today<span className="n">{completedToday.length}</span></button>
      </div>

      <div className="tab-panel">
        {tab === 'remaining' && (
          remainingToday.length === 0
            ? <div className="empty-tab">Nothing left for today 🎉</div>
            : remainingToday.map(t => (
              <div className="tab-item pending" key={t.id}>
                <span className="tname">{t.title}</span>
                <span className="tprogress">{progressLabel(t)}</span>
              </div>
            ))
        )}
        {tab === 'completed' && (
          completedToday.length === 0
            ? <div className="empty-tab">Nothing checked off yet today</div>
            : completedToday.map(t => (
              <div className="tab-item done" key={t.id}>
                <span className="tname">{t.title}</span>
                <span className="tprogress">{progressLabel(t)}</span>
              </div>
            ))
        )}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>📊 Day-wise tasks done (30 days)</h3>
          <div className="canvas-scroll">
            <div className="canvas-wrap"><BarChart data={barData} /></div>
          </div>
        </div>
        <div className="chart-card pie">
          <h3>🥧 Today's split</h3>
          <div className="canvas-wrap"><PieChart done={completedToday.length} pending={remainingToday.length} /></div>
        </div>
      </div>

      <p className="footnote">Built with React &amp; Chart.js · saved in this browser only</p>
    </div>
  );
}
