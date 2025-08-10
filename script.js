 

    const form = document.getElementById('bmiForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const bmiValue = document.getElementById('bmiValue');
    const bmiText = document.getElementById('bmiText');
    const bmiBadge = document.getElementById('bmiBadge');
    const meterFill = document.getElementById('meterFill');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('resetBtn');

    function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

    function classifyBMI(bmi){
      if (bmi < 18.5) return { text: 'Underweight', color: 'linear-gradient(90deg,#60a5fa,#3b82f6)' };
      if (bmi < 25)   return { text: 'Normal',      color: 'linear-gradient(90deg,#34d399,#10b981)' };
      if (bmi < 30)   return { text: 'Overweight',  color: 'linear-gradient(90deg,#f59e0b,#f97316)' };
      return              { text: 'Obese',       color: 'linear-gradient(90deg,#fb7185,#ef4444)' };
    }

    function formatNumber(n){ return Number.parseFloat(n).toFixed(1); }

    function showError(txt){
      message.textContent = txt;
      message.classList.add('error');
      setTimeout(()=>{ message.textContent = ''; message.classList.remove('error'); }, 3000);
    }

    function calculateBMI(){
      const w = parseFloat(weightInput.value);
      let h = parseFloat(heightInput.value);

      if (!w || !h || w <= 0 || h <= 0){
        showError('Please enter valid weight and height.');
        return;
      }

     
      if (h > 3) h = h / 100;

     
      if (h < 0.5){
       
        message.textContent = 'Using the provided height (interpreted as meters).';
        message.classList.remove('error');
      } else {
        message.textContent = '';
        message.classList.remove('error');
      }

      const bmi = w / (h * h);
      const bmiRounded = Number.parseFloat(bmi.toFixed(1));
      bmiValue.textContent = bmiRounded;
      const cls = classifyBMI(bmiRounded);
      bmiText.textContent = `${cls.text} — BMI ${bmiRounded}`;
      bmiBadge.textContent = cls.text;
      bmiBadge.style.background = cls.color;

    
      const min = 12, max = 40;
      const pct = clamp(((bmiRounded - min) / (max - min)) * 100, 0, 100);
      meterFill.style.width = pct + '%';
      
      if (bmiRounded < 18.5) meterFill.style.background = '#60a5fa';
      else if (bmiRounded < 25) meterFill.style.background = '#10b981';
      else if (bmiRounded < 30) meterFill.style.background = '#f59e0b';
      else meterFill.style.background = '#ef4444';
    }

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      calculateBMI();
    });

    resetBtn.addEventListener('click', ()=>{
      weightInput.value = '';
      heightInput.value = '';
      bmiValue.textContent = '—';
      bmiText.textContent = 'Enter values and press Calculate';
      bmiBadge.textContent = '—';
      bmiBadge.style.background = 'linear-gradient(90deg,var(--accent), #3b82f6)';
      meterFill.style.width = '0%';
      message.textContent = '';
    });

    [weightInput, heightInput].forEach(inp=>{
      inp.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter') {
          e.preventDefault();
          calculateBMI();
        }
      });
    });

    window.addEventListener('DOMContentLoaded', ()=>{
      setTimeout(()=>{ document.querySelector('.wrapper').style.transform = 'translateY(0)'; }, 80);
    });