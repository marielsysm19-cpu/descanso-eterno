const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const dialog = document.querySelector('#assistance-dialog');
const form = document.querySelector('#assistance-form');
const toast = document.querySelector('#toast');

document.querySelector('#year').textContent = new Date().getFullYear();

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-open-assistance]').forEach((button) => {
  button.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  status.textContent = 'Solicitud preparada. El envío se activará al conectar el canal de atención.';
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

document.querySelectorAll('[data-portal]').forEach((button) => {
  button.addEventListener('click', () => showToast('El portal administrativo se habilitará en la siguiente etapa.'));
});

document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`${button.dataset.service}: podemos personalizar este servicio según las necesidades de tu familia.`);
  });
});

document.querySelectorAll('.accordion details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
