// Members-only password gate for the lab hub and its pages.
// Load it in <head> (not deferred) so the page stays hidden until the password is entered.
// This only keeps casual visitors out: the password is visible in this file.
(function () {
  const PASS = 'metalab';
  const KEY = 'mlAuth';

  function unlocked() {
    try { if (localStorage.getItem(KEY) === '1') return true; } catch {}
    try { if (sessionStorage.getItem(KEY) === '1') return true; } catch {}
    return false;
  }
  function remember() {
    try { localStorage.setItem(KEY, '1'); } catch {}
    try { sessionStorage.setItem(KEY, '1'); } catch {}
  }
  if (unlocked()) return;

  const root = document.documentElement;
  root.classList.add('ml-locked');

  const style = document.createElement('style');
  style.textContent = `
    .ml-locked body > :not(#ml-gate) { visibility:hidden; }
    .ml-locked body { overflow:hidden; }
    #ml-gate {
      position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center;
      background:var(--color-bg, #fcf6ef); transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1);
    }
    #ml-gate.out { opacity:0; pointer-events:none; }
    #ml-gate .g-inner { text-align:center; max-width:400px; padding:0 24px; }
    #ml-gate .g-title {
      font-family:var(--font-display, 'Playfair Display', Georgia, serif); font-size:2rem; font-weight:500;
      color:var(--color-text, #2b180a); margin-bottom:8px;
    }
    #ml-gate .g-sub { font-size:0.9rem; line-height:1.6; color:var(--color-text-muted, #6b5a4a); margin-bottom:28px; }
    #ml-gate form { display:flex; gap:8px; }
    #ml-gate input {
      flex:1; min-width:0; padding:12px 20px; border:1.5px solid var(--color-border, #e0d4c6); border-radius:100px;
      background:var(--color-bg-warm, #f6f0e9); font:inherit; font-size:0.875rem; color:var(--color-text, #2b180a); outline:none;
    }
    #ml-gate input:focus { border-color:var(--color-accent, #c8956c); }
    #ml-gate button {
      padding:12px 26px; border:0; border-radius:100px; cursor:pointer; font:inherit; font-size:0.875rem; font-weight:500;
      background:var(--color-bg-dark, #2b180a); color:var(--color-bg, #fcf6ef);
    }
    #ml-gate button:focus-visible { outline:2px solid var(--color-accent, #c8956c); outline-offset:3px; }
    #ml-gate .g-error { min-height:1.4em; margin-top:12px; font-size:0.82rem; color:#a5574c; }
  `;
  document.head.appendChild(style);

  function show() {
    const gate = document.createElement('div');
    gate.id = 'ml-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'ml-gate-title');
    gate.innerHTML = `
      <div class="g-inner">
        <h2 class="g-title" id="ml-gate-title">Members area</h2>
        <p class="g-sub">These pages are for USYD Meta Lab members. Enter the lab password to continue.</p>
        <form>
          <input type="password" placeholder="Lab password" aria-label="Lab password" autocomplete="current-password">
          <button type="submit">Enter</button>
        </form>
        <p class="g-error" role="alert"></p>
      </div>`;
    document.body.appendChild(gate);
    const input = gate.querySelector('input');
    input.focus();
    gate.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      if (input.value === PASS) {
        remember();
        root.classList.remove('ml-locked');
        gate.classList.add('out');
        setTimeout(() => gate.remove(), 500);
      } else {
        gate.querySelector('.g-error').textContent = 'Incorrect password. Try again.';
        input.value = '';
        input.focus();
      }
    });
  }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
