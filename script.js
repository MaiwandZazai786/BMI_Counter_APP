// --- script.js ---
// BMI Calculator with modal name prompt + toast notifications

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("nameModal");
  const userNameInput = document.getElementById("userNameInput");
  const submitNameBtn = document.getElementById("submitNameBtn");

  const form = document.getElementById('bmiForm') || document.querySelector('form');
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const bmiValue = document.getElementById('bmiValue');
  const bmiText = document.getElementById('bmiText');
  const bmiBadge = document.getElementById('bmiBadge');
  const meterFill = document.getElementById('meterFill');
  const message = document.getElementById('message');
  const resetBtn = document.getElementById('resetBtn');

  let userName = "";

  // Show modal on load
  modal.style.display = "flex";

  // Toast container & showToast function (if not present, create)
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
    // entrance animation
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

  // Handle name submission
  submitNameBtn.addEventListener("click", function () {
    if (userNameInput.value.trim() !== "") {
      userName = userNameInput.value.trim();
      modal.style.display = "none";
      showToast(`Welcome, ${userName}!`, { duration: 3000 });
    } else {
      alert("Please enter your full name!");
    }
  });

  // Helpers
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function formatOneDecimal(n) { return Math.round(n * 10) / 10; }

  function classifyBMI(bmi) {
    if (bmi < 18.5) return { text: 'Underweight', color: 'linear-gradient(90deg,#60a5fa,#3b82f6)', meterColor: '#60a5fa' };
    if (bmi < 25)   return { text: 'Normal',      color: 'linear-gradient(90deg,#34d399,#10b981)', meterColor: '#10b981' };
    if (bmi < 30)   return { text: 'Overweight',  color: 'linear-gradient(90deg,#f59e0b,#f97316)', meterColor: '#f59e0b' };
                    return { text: 'Obese',       color: 'linear-gradient(90deg,#fb7185,#ef4444)', meterColor: '#ef4444' };
  }

  function calculateBMI() {
    const w = parseFloat(weightInput.value);
    let h = parseFloat(heightInput.value);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      showInlineMessage('Please enter valid weight and height values.', true);
      showToast('Please enter valid weight and height values.', { error: true });
      return;
    }

    if (h > 3) h = h / 100;

    if (h <= 0.4) {
      showInlineMessage('Height looks too small — please check the value.', true);
      showToast('Height looks too small — please check the value.', { error: true });
      return;
    }

    const bmi = w / (h * h);
    const bmiRounded = formatOneDecimal(bmi);

    const cls = classifyBMI(bmiRounded);
    if (bmiValue) bmiValue.textContent = bmiRounded;
    if (bmiText) bmiText.textContent = `${cls.text} — BMI ${bmiRounded}`;
    if (bmiBadge) {
      bmiBadge.textContent = cls.text;
      bmiBadge.style.background = cls.color;
    }
    if (meterFill) {
      const pct = clamp(((bmiRounded - 12) / (40 - 12)) * 100, 0, 100);
      meterFill.style.width = pct + '%';
      meterFill.style.background = cls.meterColor;
    }

    let userMsg = `Hi ${userName}, your BMI is ${bmiRounded}. `;
    if (bmiRounded < 18.5) {
      userMsg += 'You are slightly underweight — consider a nourishing, balanced diet and regular checkups. Take care of your health!';
    } else if (bmiRounded < 25) {
      userMsg += 'Great job — your BMI is in the healthy range. Keep up the balanced lifestyle and stay active!';
    } else if (bmiRounded < 30) {
      userMsg += 'You are slightly above the healthy range. Small lifestyle changes (diet + activity) can help — consider checking with a healthcare professional if concerned.';
    } else {
      userMsg += 'Your BMI is in a higher range. It would be wise to consult a healthcare professional for personalised advice — please take care.';
    }

    showInlineMessage(userMsg, false);
    showToast(userMsg, { duration: 7000, error: bmiRounded >= 30 });

    if (resetBtn) resetBtn.focus();
  }

  // Event listeners
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      calculateBMI();
    });
  }

  [weightInput, heightInput].forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateBMI();
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      weightInput.value = '';
      heightInput.value = '';
      if (bmiValue) bmiValue.textContent = '—';
      if (bmiText) bmiText.textContent = 'Enter values and press Calculate';
      if (bmiBadge) {
        bmiBadge.textContent = '—';
        bmiBadge.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)';
      }
      if (meterFill) meterFill.style.width = '0%';
      if (message) message.textContent = '';
      showToast('Reset complete', { duration: 1600 });
    });
  }

});
