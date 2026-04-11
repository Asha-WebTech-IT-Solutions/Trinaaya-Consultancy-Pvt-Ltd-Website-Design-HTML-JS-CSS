/* ================================================
   TRINAAYA - EMI Calculator, Eligibility & Comparison
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- EMI Calculator ---
  var amountSlider = document.getElementById('loanAmount');
  var rateSlider = document.getElementById('interestRate');
  var tenureSlider = document.getElementById('loanTenure');
  var amountDisplay = document.getElementById('amountDisplay');
  var rateDisplay = document.getElementById('rateDisplay');
  var tenureDisplay = document.getElementById('tenureDisplay');
  var amountInput = document.getElementById('amountInput');
  var rateInput = document.getElementById('rateInput');

  function formatCurrency(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    return '₹' + num.toLocaleString('en-IN');
  }

  function calculateEMI() {
    if (!amountSlider || !rateSlider || !tenureSlider) return;

    var P = parseInt(amountSlider.value);
    var annualRate = parseFloat(rateSlider.value);
    var years = parseInt(tenureSlider.value);
    var months = years * 12;
    var r = annualRate / 12 / 100;

    // Update displays
    if (amountDisplay) amountDisplay.textContent = formatCurrency(P);
    if (rateDisplay) rateDisplay.textContent = annualRate.toFixed(1) + '%';
    if (tenureDisplay) tenureDisplay.textContent = years + (years === 1 ? ' Year' : ' Years');
    if (amountInput) amountInput.value = P;
    if (rateInput) rateInput.value = annualRate;

    // EMI formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    var emi;
    if (r === 0) {
      emi = P / months;
    } else {
      emi = P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    }

    var totalPayment = emi * months;
    var totalInterest = totalPayment - P;

    // Update output
    var emiAmountEl = document.getElementById('emiAmount');
    var emiMonthsEl = document.getElementById('emiMonths');
    var principalEl = document.getElementById('principalAmount');
    var interestEl = document.getElementById('totalInterest');
    var totalEl = document.getElementById('totalPayment');

    if (emiAmountEl) emiAmountEl.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
    if (emiMonthsEl) emiMonthsEl.textContent = 'per month for ' + months + ' months';
    if (principalEl) principalEl.textContent = formatCurrency(P);
    if (interestEl) interestEl.textContent = formatCurrency(Math.round(totalInterest));
    if (totalEl) totalEl.textContent = formatCurrency(Math.round(totalPayment));

    // Amortization schedule
    generateAmortization(P, r, months, emi);
  }

  function generateAmortization(principal, monthlyRate, totalMonths, emi) {
    var tbody = document.getElementById('amortBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    var balance = principal;
    var years = totalMonths / 12;

    for (var year = 1; year <= years; year++) {
      var yearPrincipal = 0;
      var yearInterest = 0;
      var yearTotal = 0;
      var openingBalance = balance;

      for (var month = 0; month < 12; month++) {
        if (balance <= 0) break;
        var interest = balance * monthlyRate;
        var principalPart = emi - interest;
        if (principalPart > balance) principalPart = balance;
        yearInterest += interest;
        yearPrincipal += principalPart;
        yearTotal += (principalPart + interest);
        balance -= principalPart;
      }

      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + year + '</td>' +
        '<td>' + formatCurrency(Math.round(openingBalance)) + '</td>' +
        '<td>' + formatCurrency(Math.round(yearPrincipal)) + '</td>' +
        '<td>' + formatCurrency(Math.round(yearInterest)) + '</td>' +
        '<td>' + formatCurrency(Math.round(yearTotal)) + '</td>' +
        '<td>' + formatCurrency(Math.max(0, Math.round(balance))) + '</td>';
      tbody.appendChild(row);
    }
  }

  // Bind slider events
  if (amountSlider) {
    amountSlider.addEventListener('input', calculateEMI);
    rateSlider.addEventListener('input', calculateEMI);
    tenureSlider.addEventListener('input', calculateEMI);
    calculateEMI(); // Initial calculation
  }

  // Sync exact value inputs
  if (amountInput) {
    amountInput.addEventListener('change', function () {
      amountSlider.value = this.value;
      calculateEMI();
    });
  }
  if (rateInput) {
    rateInput.addEventListener('change', function () {
      rateSlider.value = this.value;
      calculateEMI();
    });
  }

  // --- Eligibility Checker ---
  var eligibilityForm = document.getElementById('eligibilityForm');
  if (eligibilityForm) {
    var currentStep = 1;
    var totalSteps = 4;
    var answers = {};

    var steps = eligibilityForm.querySelectorAll('.eligibility-step');

    eligibilityForm.querySelectorAll('.eligibility-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepEl = steps[currentStep - 1];
        var checked = stepEl.querySelector('input[type="radio"]:checked');
        var textInput = stepEl.querySelector('input[type="text"], input[type="number"], select');

        if (checked) {
          answers['step' + currentStep] = checked.value;
        } else if (textInput && textInput.value.trim()) {
          answers['step' + currentStep] = textInput.value;
        } else {
          alert('Please select an option to continue.');
          return;
        }

        if (currentStep < totalSteps) {
          steps[currentStep - 1].style.display = 'none';
          currentStep++;
          steps[currentStep - 1].style.display = 'block';
        } else {
          showEligibilityResult();
        }
      });
    });

    function showEligibilityResult() {
      steps.forEach(function (s) { s.style.display = 'none'; });
      var resultEl = document.getElementById('eligibilityResult');
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML =
          '<div style="text-align:center;padding:32px;">' +
          '<div style="width:64px;height:64px;background:rgba(27,191,131,0.12);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">' +
          '<i class="fas fa-check" style="color:#1bbf83;font-size:1.5rem;"></i></div>' +
          '<h3 style="color:#0f2a44;margin-bottom:8px;">Assessment Complete!</h3>' +
          '<p style="color:#555;margin-bottom:20px;">Based on your inputs, our team will provide a personalized eligibility assessment. We\'ll reach out within 2 hours.</p>' +
          '<a href="https://wa.me/918360073636?text=Hi! I just completed the eligibility checker on your website. Please help me with my loan eligibility." class="btn btn-whatsapp" target="_blank"><i class="fab fa-whatsapp"></i> Get Results on WhatsApp</a>' +
          '</div>';
      }
    }
  }

  // --- Loan Comparison ---
  var compareBtn = document.getElementById('compareBtn');
  if (compareBtn) {
    compareBtn.addEventListener('click', function () {
      var a = {
        bank: document.getElementById('bankA').value || 'Bank A',
        amount: parseFloat(document.getElementById('amountA').value) || 0,
        rate: parseFloat(document.getElementById('rateA').value) || 0,
        tenure: parseInt(document.getElementById('tenureA').value) || 0,
        fee: parseFloat(document.getElementById('feeA').value) || 0
      };
      var b = {
        bank: document.getElementById('bankB').value || 'Bank B',
        amount: parseFloat(document.getElementById('amountB').value) || 0,
        rate: parseFloat(document.getElementById('rateB').value) || 0,
        tenure: parseInt(document.getElementById('tenureB').value) || 0,
        fee: parseFloat(document.getElementById('feeB').value) || 0
      };

      function calcTotal(opt) {
        var months = opt.tenure * 12;
        var r = opt.rate / 12 / 100;
        var emi;
        if (r === 0) { emi = opt.amount / months; }
        else { emi = opt.amount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1); }
        var total = emi * months + opt.fee;
        return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - opt.amount - opt.fee) };
      }

      var resultA = calcTotal(a);
      var resultB = calcTotal(b);

      var resultDiv = document.getElementById('compareResult');
      if (resultDiv) {
        resultDiv.classList.add('visible');
        var betterEMI = resultA.emi < resultB.emi ? 'A' : 'B';
        var betterTotal = resultA.total < resultB.total ? 'A' : 'B';

        resultDiv.innerHTML =
          '<h4>Comparison Results</h4>' +
          '<table class="compare-table">' +
          '<tr><th></th><th>' + a.bank + '</th><th>' + b.bank + '</th></tr>' +
          '<tr><td>Monthly EMI</td><td class="' + (betterEMI === 'A' ? 'winner' : '') + '">₹' + resultA.emi.toLocaleString('en-IN') + '</td><td class="' + (betterEMI === 'B' ? 'winner' : '') + '">₹' + resultB.emi.toLocaleString('en-IN') + '</td></tr>' +
          '<tr><td>Total Interest</td><td>₹' + resultA.interest.toLocaleString('en-IN') + '</td><td>₹' + resultB.interest.toLocaleString('en-IN') + '</td></tr>' +
          '<tr><td>Processing Fee</td><td>₹' + a.fee.toLocaleString('en-IN') + '</td><td>₹' + b.fee.toLocaleString('en-IN') + '</td></tr>' +
          '<tr><td><strong>Total Cost</strong></td><td class="' + (betterTotal === 'A' ? 'winner' : '') + '"><strong>₹' + resultA.total.toLocaleString('en-IN') + '</strong></td><td class="' + (betterTotal === 'B' ? 'winner' : '') + '"><strong>₹' + resultB.total.toLocaleString('en-IN') + '</strong></td></tr>' +
          '</table>' +
          '<p style="margin-top:16px;text-align:center;font-size:0.9rem;color:#555;"><strong style="color:#1bbf83;">' + (betterTotal === 'A' ? a.bank : b.bank) + '</strong> saves you ₹' + Math.abs(resultA.total - resultB.total).toLocaleString('en-IN') + ' overall.</p>';
      }
    });
  }
});
