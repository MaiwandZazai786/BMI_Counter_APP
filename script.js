

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

    modal.style.display = "flex";

    submitNameBtn.addEventListener("click", function () {
        if (userNameInput.value.trim() !== "") {
            userName = userNameInput.value.trim();
            modal.style.display = "none";
        } else {
            alert("Please enter your full name!");
        }
    });

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function formatOneDecimal(n) { return Math.round(n * 10) / 10; }

    function classifyBMI(bmi) {
        if (bmi < 18.5) return { text: 'Underweight', color: 'linear-gradient(90deg,#60a5fa,#3b82f6)', meterColor: '#60a5fa' };
        if (bmi < 25)   return { text: 'Normal',      color: 'linear-gradient(90deg,#34d399,#10b981)', meterColor: '#10b981' };
        if (bmi < 30)   return { text: 'Overweight',  color: 'linear-gradient(90deg,#f59e0b,#f97316)', meterColor: '#f59e0b' };
                        return { text: 'Obese',       color: 'linear-gradient(90deg,#fb7185,#ef4444)', meterColor: '#ef4444' };
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
            return;
        }

        if (h > 3) h = h / 100;

        if (h <= 0.4) {
            showInlineMessage('Height looks too small — please check the value.', true);
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

        let userMsg = `Dear ${userName}, your BMI is ${bmiRounded}. `;
        if (bmiRounded < 18.5) {
            userMsg += "You're underweight. Please take care of your diet.";
        } else if (bmiRounded <= 24.9) {
            userMsg += "Great! You have a healthy BMI. Keep it up!";
        } else {
            userMsg += "Your BMI is higher than normal. Consider a balanced lifestyle.";
        }

        showInlineMessage(userMsg);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateBMI();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            weightInput.value = '';
            heightInput.value = '';
            if (bmiValue) bmiValue.textContent = '—';
            if (bmiText) bmiText.textContent = 'Enter values and press Calculate';
            if (bmiBadge) bmiBadge.textContent = '—';
            if (meterFill) meterFill.style.width = '0%';
            if (message) message.textContent = '';
        });
    }
});
