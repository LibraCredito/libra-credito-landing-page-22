const texts = [
  'Crédito com Garantia de Imóvel',
  'Home Equity',
  'Capital de Giro Inteligente',
  'Empréstimo com Garantia de Imóvel',
  'Consolidação Estratégica de Débitos'
];
let index = 0;
const span = document.getElementById('alternating-text');
function cycleText() {
  span.classList.add('fade-out');
  setTimeout(() => {
    span.textContent = texts[index];
    span.classList.remove('fade-out');
    span.classList.add('fade-in');
    index = (index + 1) % texts.length;
  }, 500);
}
window.addEventListener('DOMContentLoaded', () => {
  setInterval(cycleText, 4000);
});
