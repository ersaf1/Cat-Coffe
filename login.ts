import { supabase } from './src/lib/supabase';

function togglePwd(id: string) {
  const input = document.getElementById(id) as HTMLInputElement;
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// Expose for onClick mapping in HTML
(window as any).togglePwd = togglePwd;

const form = document.getElementById('loginForm') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const pwdInput = document.getElementById('password') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const spinner = document.getElementById('spinner') as HTMLElement;
const mainAlert = document.getElementById('mainAlert') as HTMLElement;

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Loading state
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    const btnSpan = submitBtn.querySelector('span');
    if (btnSpan) btnSpan.textContent = 'Signing in...';
    mainAlert.style.display = 'none';

    try {
      const username = usernameInput.value;
      const password = pwdInput.value;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, full_name, phone')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (!error && user) {
        mainAlert.textContent = 'Welcome back!';
        mainAlert.className = 'alert alert-success';
        mainAlert.style.display = 'block';
        
        localStorage.setItem('user', JSON.stringify(user));
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        mainAlert.textContent = 'Invalid credentials';
        mainAlert.className = 'alert alert-error';
        mainAlert.style.display = 'block';
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        if (btnSpan) btnSpan.textContent = 'Sign In';
      }
    } catch (err) {
      mainAlert.textContent = 'Could not reach server. Please check your connection.';
      mainAlert.className = 'alert alert-error';
      mainAlert.style.display = 'block';
      submitBtn.disabled = false;
      spinner.style.display = 'none';
      if (btnSpan) btnSpan.textContent = 'Sign In';
    }
  });
}