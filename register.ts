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

const form = document.getElementById('registerForm') as HTMLFormElement;
const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const pwdInput = document.getElementById('password') as HTMLInputElement;
const confirmInput = document.getElementById('confirmPassword') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const spinner = document.getElementById('spinner') as HTMLElement;
const mainAlert = document.getElementById('mainAlert') as HTMLElement;

function showError(elementId: string, show: boolean) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = show ? 'block' : 'none';
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset validation states
    let hasError = false;
    showError('emailError', false);
    showError('pwdError', false);
    showError('confirmError', false);
    
    emailInput.classList.remove('input-error');
    pwdInput.classList.remove('input-error');
    confirmInput.classList.remove('input-error');

    // Validate
    if (emailInput.value.trim() === '') {
      showError('emailError', true);
      emailInput.classList.add('input-error');
      hasError = true;
    }

    if (pwdInput.value.length < 6) {
      showError('pwdError', true);
      pwdInput.classList.add('input-error');
      hasError = true;
    }

    if (pwdInput.value !== confirmInput.value) {
      showError('confirmError', true);
      confirmInput.classList.add('input-error');
      hasError = true;
    }

    if (hasError) return;

    // Loading state
    submitBtn.disabled = true;
    spinner.style.display = 'block';
    
    const btnSpan = submitBtn.querySelector('span');
    if (btnSpan) btnSpan.textContent = 'Processing...';
    mainAlert.style.display = 'none';

    try {
      const full_name = fullNameInput.value;
      const phone = phoneInput.value;
      const username = emailInput.value;
      const password = pwdInput.value;

      // 1. Check if username exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        mainAlert.textContent = 'Username is already taken';
        mainAlert.className = 'alert alert-error';
        mainAlert.style.display = 'block';
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        if (btnSpan) btnSpan.textContent = 'Create Account';
        return;
      }

      // 2. Insert User
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, password, full_name, phone }])
        .select('id, username')
        .single();
      
      if (!error && data) {
        mainAlert.textContent = 'Account created successfully! Redirecting to login...';
        mainAlert.className = 'alert alert-success';
        mainAlert.style.display = 'block';
        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        mainAlert.textContent = error?.message || 'Registration failed';
        mainAlert.className = 'alert alert-error';
        mainAlert.style.display = 'block';
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        if (btnSpan) btnSpan.textContent = 'Create Account';
      }
    } catch (err) {
      mainAlert.textContent = 'Could not reach server. Please check your connection.';
      mainAlert.className = 'alert alert-error';
      mainAlert.style.display = 'block';
      submitBtn.disabled = false;
      spinner.style.display = 'none';
      if (btnSpan) btnSpan.textContent = 'Create Account';
    }
  });

  // Real-time validation
  pwdInput.addEventListener('input', () => {
    if (pwdInput.value.length >= 6) {
      showError('pwdError', false);
      pwdInput.classList.remove('input-error');
    }
  });

  confirmInput.addEventListener('input', () => {
    if (pwdInput.value === confirmInput.value) {
      showError('confirmError', false);
      confirmInput.classList.remove('input-error');
    }
  });
}