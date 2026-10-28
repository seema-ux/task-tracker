import { DAY_KEYS, TODAY_INDEX } from './constants.js';

export default function DayCheckboxes({ task, onToggle }) {
  return (
    <div className="day-grid">
      {DAY_KEYS.map(d => {
        const checked = task.days[d];
        const showLabel = d % 5 === 0 || d === 1;
        return (
          <div
            key={d}
            className={'day-box' + (d === TODAY_INDEX ? ' today' : '')}
            onClick={() => onToggle(task.id, d)}
            title={'Day ' + d}
          >
            <span className="dlabel">{showLabel ? d : ''}</span>
            <span className={'dbox' + (checked ? ' checked' : '')}>{checked ? '✓' : ''}</span>
          </div>
        );
      })}
    </div>
  );
}
