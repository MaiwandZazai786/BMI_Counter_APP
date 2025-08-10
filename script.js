// --- Replace your current script.js / <script> content with this ---
// Robust BMI script with name prompt + polite personalized messages

(function () {
  const form = document.getElementById('bmiForm') || document.querySelector('form');
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const bmiValue = document.getElementById('bmiValue');
  const bmiText = document.getElementById('bmiText');
  const bmiBadge = document.getElementById('bmiBadge');
  const meterFill = document.getElementById('meterFill');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !weightInput || !heightInput) {
    console.warn('BMI script: required elements (form, weight, height) not found.');
    return;
  }

  const STORAGE_KEY = 'bmi_userName_v1';
  let userName = localStorage.getItem(STORAGE_KEY);

  function askForName(initial = false) {
    const promptText = initial
      ? 'Welcome! Please enter your full name (or leave blank to continue as Guest):'
      : 'Enter a new full name (or leave blank to keep current):';
    let name = prompt(promptText, userName || '');
    if (name === null) { // user cancelled
      if (!userName) userName = 'Guest';
      return;
    }
    name = (name || '').trim();
    if (!name) name = 'Guest';
    userName = name;
    localStorage.setItem(STORAGE_KEY, userName);
    showToast(`Hello, ${userName}!`, { duration: 2500 });
  }

  if (!userName) {
    // prompt once when app first opens
    askForName(true);
  }

  // Utility helpers
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function formatOneDecimal(n) { return Math.round(n * 10) / 10; }

  function classifyBMI(bmi) {
    if (bmi < 18.5) return { text: 'Underweight', color: 'linear-gradient(90deg,#60a5fa,#3b82f6)', meterColor: '#60a5fa' };
    if (bmi < 25)   return { text: 'Normal',      color: 'linear-gradient(90deg,#34d399,#10b981)', meterColor: '#10b981' };
    if (bmi < 30)   return { text: 'Overweight',  color: 'linear-gradient(90deg,#f59e0b,#f97316)', meterColor: '#f59e0b' };
                    return { text: 'Obese',       color: 'linear-gradient(90deg,#fb7185,#ef4444)', meterColor: '#ef4444' };
  }

  // Toast creation (creates container on demand)
  function showToast(text, { duration = 5000, error = false } = {}) {
    let container = document.getElementById('bmiToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bmiToastContainer';
      container.style.position = 'fixed';
      container.style.right = '20px';
      container.style.top = '20px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const t = document.createElement('div');
    t.textContent = text;
    t.style.minWidth = '240px';
    t.style.maxWidth = '420px';
    t.style.padding = '12px 14px';
    t.style.borderRadius = '10px';
    t.style.boxShadow = '0 10px 30px rgba(8,20,40,0.12)';
    t.style.transition = 'all 280ms ease';
    t.style.opacity = '0';
    t.style.transform = 'translateY(-6px)';
    t.style.fontSize = '0.95rem';
    if (error) {
      t.style.background = 'linear-gradient(90deg,#fff1f0,#ffe3e3)';
      t.style.color = '#7a1414';
      t.style.border = '1px solid rgba(239,68,68,0.12)';
    } else {
      t.style.background = 'linear-gradient(90deg,#f8fffb,#e6f8ff)';
      t.style.color = '#042023';
      t.style.border = '1px solid rgba(6,182,212,0.06)';
    }
    container.appendChild(t);
    // entrance
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    // remove after duration
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-6px)';
      setTimeout(() => { t.remove(); }, 300);
    }, duration);
  }

  function showInlineMessage(txt, isError = false) {
    if (!message) return;
    message.textContent = txt;
    if (isError) {
      message.classList.add('error');
    } else {
      message.classList.remove('error');
    }
  }

  function calculateBMI() {
    const w = parseFloat(weightInput.value);
    let h = parseFloat(heightInput.value);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      showInlineMessage('Please enter valid weight and height values.', true);
      showToast('Please enter valid weight and height values.', { error: true });
      return;
    }

    // Convert cm -> meters if user likely provided cm
    if (h > 3) h = h / 100;

    if (h <= 0.4) {
      // guard for very small numbers (probably user error)
      showInlineMessage('Height looks too small — please check the value.', true);
      showToast('Height looks too small — please check the value.', { error: true });
      return;
    }

    const bmi = w / (h * h);
    const bmiRounded = formatOneDecimal(bmi);

    // Update visible UI pieces (if present)
    if (bmiValue) bmiValue.textContent = bmiRounded;
    const cls = classifyBMI(bmiRounded);
    if (bmiText) bmiText.textContent = `${cls.text} — BMI ${bmiRounded}`;
    if (bmiBadge) {
      bmiBadge.textContent = cls.text;
      bmiBadge.style.background = cls.color;
      bmiBadge.style.cursor = 'pointer';
      bmiBadge.title = 'Click to change your name';
    }
    if (meterFill) {
      const min = 12, max = 40;
      const pct = clamp(((bmiRounded - min) / (max - min)) * 100, 0, 100);
      meterFill.style.width = pct + '%';
      meterFill.style.background = cls.meterColor;
    }

    // Personalized friendly guidance
    let userMsg = `${userName}, your BMI is ${bmiRounded}. `;
    if (bmiRounded < 18.5) {
      userMsg += 'You are slightly underweight — consider a nourishing, balanced diet and regular checkups. Take care of your health!';
    } else if (bmiRounded < 25) {
      userMsg += 'Great job — your BMI is in the healthy range. Keep up the balanced lifestyle and stay active!';
    } else if (bmiRounded < 30) {
      userMsg += 'You are slightly above the healthy range. Small lifestyle changes (diet + activity) can help — consider checking with a healthcare professional if concerned.';
    } else {
      userMsg += 'Your BMI is in a higher range. It would be wise to consult a healthcare professional for personalised advice — please take care.';
    }

    // show inline and toast
    showInlineMessage(userMsg, false);
    showToast(userMsg, { duration: 7000, error: bmiRounded >= 30 });

    // also focus reset button for quick next action (optional)
    if (resetBtn) resetBtn.focus();
  }

  // Event wiring
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    calculateBMI();
  });

  // Allow Enter in inputs to calculate as well
  [weightInput, heightInput].forEach((inp) => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateBMI();
      }
    });
  });

  // Reset behavior (keeps stored name)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      weightInput.value = '';
      heightInput.value = '';
      if (bmiValue) bmiValue.textContent = '—';
      if (bmiText) bmiText.textContent = 'Enter values and press Calculate';
      if (bmiBadge) {
        bmiBadge.textContent = '—';
        // restore default gradient if you had CSS variable; fallback here:
        bmiBadge.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)';
      }
      if (meterFill) meterFill.style.width = '0%';
      if (message) message.textContent = '';
      showToast('Reset complete', { duration: 1600 });
    });
  }

  // Click badge to change name
  if (bmiBadge) {
    bmiBadge.addEventListener('click', () => {
      askForName(false);
    });
  }

  // expose small API to change name from console if needed
  window.bmiApp = {
    changeName: () => askForName(false),
    getName: () => userName
  };

})();
