import { useEffect, useState } from 'react';
import { MEAL_LABELS, MEAL_ORDER, formatChineseDate, weekdayLabel } from '@daily-menu/shared';
import type { MealType } from '@daily-menu/shared';
import { Modal } from './Modal';

interface AddToMenuDialogProps {
  open: boolean;
  title?: string;
  dates: string[];
  defaultDate: string;
  defaultMeal?: MealType;
  onClose: () => void;
  onConfirm: (date: string, meal: MealType) => void;
}

export function AddToMenuDialog({
  open,
  title = '加入本周菜单',
  dates,
  defaultDate,
  defaultMeal = 'dinner',
  onClose,
  onConfirm,
}: AddToMenuDialogProps) {
  const [date, setDate] = useState(defaultDate);
  const [meal, setMeal] = useState<MealType>(defaultMeal);

  useEffect(() => {
    if (!open) return;
    setDate(dates.includes(defaultDate) ? defaultDate : dates[0] ?? defaultDate);
    setMeal(defaultMeal);
  }, [open, defaultDate, defaultMeal, dates]);

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onConfirm(date, meal);
              onClose();
            }}
          >
            加入菜单
          </button>
        </>
      }
    >
      <div className="field">
        <span className="field-label">日期</span>
        <div className="chip-select">
          {dates.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip-toggle small ${item === date ? 'selected' : ''}`}
              onClick={() => setDate(item)}
            >
              {weekdayLabel(item, true)} {formatChineseDate(item, false)}
            </button>
          ))}
        </div>
      </div>
      <div className="field" style={{ marginBottom: 4 }}>
        <span className="field-label">餐次</span>
        <div className="chip-select">
          {MEAL_ORDER.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip-toggle small ${item === meal ? 'selected' : ''}`}
              onClick={() => setMeal(item)}
            >
              {MEAL_LABELS[item]}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
