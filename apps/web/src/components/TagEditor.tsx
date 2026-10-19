import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { IconPlus, IconX } from './icons';

interface TagEditorProps {
  label: string;
  hint?: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  quickOptions?: string[];
  tone?: 'green' | 'orange' | 'red';
}

export function TagEditor({
  label,
  hint,
  placeholder = '输入后按回车添加',
  values,
  onChange,
  quickOptions = [],
  tone = 'green',
}: TagEditorProps) {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const value = raw.trim().replace(/[,，;；]/g, '').slice(0, 20);
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add(draft);
    } else if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="field">
      <span className="field-label">
        <span>{label}</span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </span>
      <div className="tag-input">
        <input
          className="input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={label}
        />
        <button type="button" className="btn btn-ghost" onClick={() => add(draft)} disabled={!draft.trim()}>
          <IconPlus size={15} />
          添加
        </button>
      </div>

      {quickOptions.length > 0 ? (
        <div className="tag-box" style={{ marginTop: 2 }}>
          {quickOptions.map((option) => {
            const selected = values.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`chip-toggle small ${selected ? 'selected' : ''}`}
                onClick={() => (selected ? onChange(values.filter((item) => item !== option)) : add(option))}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}

      {values.length > 0 ? (
        <div className="tag-box">
          {values.map((value) => (
            <span
              className="tag-item"
              key={value}
              style={
                tone === 'orange'
                  ? { background: 'var(--orange-soft)', borderColor: '#f2d3bb', color: 'var(--orange-deep)' }
                  : tone === 'red'
                    ? { background: 'var(--red-soft)', borderColor: '#f0d3cd', color: 'var(--red)' }
                    : undefined
              }
            >
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((item) => item !== value))}
                aria-label={`移除 ${value}`}
              >
                <IconX size={13} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <span className="tiny muted">暂无，添加后会从推荐中排除相关菜谱。</span>
      )}
    </div>
  );
}
