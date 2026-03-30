const amountBtns = document.querySelectorAll('.amount-btn');
const customAmount = document.getElementById('custom-amount');
const form = document.getElementById('donation-form');

amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    customAmount.value = btn.dataset.amount;
  });
});

customAmount.addEventListener('input', () => {
  amountBtns.forEach(b => b.classList.remove('selected'));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    email: form.email.value,
    amount: customAmount.value,
    message: form.message.value,
  };
  console.log('Donation submitted:', data);
  alert(`Thank you, ${data.name}! Your $${data.amount} donation has been received.`);
  form.reset();
  amountBtns.forEach(b => b.classList.remove('selected'));
});
