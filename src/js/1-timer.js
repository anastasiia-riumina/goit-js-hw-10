

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  inputEl: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

// Стартова блокування кнопки
refs.startBtn.disabled = true;

flatpickr(refs.inputEl, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (pickedDate <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = pickedDate;
      refs.startBtn.disabled = false;
    }
  },
});

refs.startBtn.addEventListener('click', () => {
  // Блокування після запуску
  refs.inputEl.disabled = true;
  refs.startBtn.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const msLeft = userSelectedDate - now;

    if (msLeft <= 0) {
      clearInterval(timerId);
      updateClock({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.inputEl.disabled = false;
      return;
    }

    const time = convertMs(msLeft);
    updateClock(time);
  }, 1000);
});

function updateClock({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}