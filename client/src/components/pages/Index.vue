<script setup lang="ts">
import {onMounted} from 'vue';
import router from '~@/router.ts';
import RegisterForm from '~@/components/components/RegisterForm.vue';
import LoginForm from '~@/components/components/LoginForm.vue';
import defaultProfilePic from '~@/assets/images/square-logo-with-background.avif?url';
import {fetchApi, getJsonHeaders} from '~@/helpers.ts';
import apiConfig from '~@/config/apiConfig.ts';

const {auth: {login, register}, user: {me}, attachment} = apiConfig;

async function handleLoginSubmit(e: SubmitEvent, loginEmailInput: HTMLInputElement, loginPasswordInput: HTMLInputElement, loginError: HTMLElement) {
  e.preventDefault();

  const data = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  };

  try {
    const responseJson = await fetchApi(login, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    localStorage.setItem('token', responseJson.token);
    await handlePostLogin();
  } catch (error: any) {
    loginError.textContent = error.message;
    loginError.classList.remove('d-none');
  }
}

async function handleRegistrationSubmit(e: SubmitEvent, registerEmailInput: HTMLInputElement, registerNameInput: HTMLInputElement, registerPasswordInput: HTMLInputElement, registerPasswordConfirmInput: HTMLInputElement, registerError: HTMLElement, registerSuccess: HTMLElement, registerForm: HTMLElement, loginForm: HTMLElement) {
  e.preventDefault();

  if (registerPasswordInput.value !== registerPasswordConfirmInput.value) {
    registerError.textContent = "Les mots de passe ne correspondent pas";
    registerError.classList.remove('d-none');
    return;
  }

  const data = {
    email: registerEmailInput.value,
    name: registerNameInput.value,
    password: registerPasswordInput.value,
    confirmPassword: registerPasswordConfirmInput.value,
  };

  try {
    await fetchApi(register, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    registerSuccess.classList.remove('d-none');
    registerError.classList.add('d-none');
    registerForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
  } catch (error: any) {
    registerError.textContent = error.message;
    registerError.classList.remove('d-none');
  }
}

async function handlePostLogin() {
  try {
    const responseJson = await fetchApi(me, {
      method: 'GET',
      headers: getJsonHeaders(),
    });

    localStorage.setItem('userId', responseJson.id);
    localStorage.setItem('username', responseJson.name);
    localStorage.setItem('email', responseJson.email);
    localStorage.setItem('profilePictureUrl', responseJson.profilePicture ? `${attachment}${responseJson.profilePicture}` : defaultProfilePic);

    const routeName = responseJson.hasSeenIntro ? 'messages' : 'setup';
    window.location.href = router.resolve({name: routeName}).href;
  } catch (error: any) {
    console.error(error.message);
  }
}

onMounted(() => {
  const loginForm = document.getElementById('loginForm')!;
  const registerForm = document.getElementById('registerForm')!;
  const showLoginFormLink = document.getElementById('showLoginFormLink')! as HTMLLinkElement;
  const showRegisterFormLink = document.getElementById('showRegisterFormLink')! as HTMLLinkElement;

  const loginEmailInput = document.getElementById('loginEmailInput')! as HTMLInputElement;
  const loginPasswordInput = document.getElementById('loginPasswordInput')! as HTMLInputElement;
  const loginError = document.getElementById('loginError')!;

  const registerEmailInput = document.getElementById('registerEmailInput')! as HTMLInputElement;
  const registerPasswordInput = document.getElementById('registerPasswordInput')! as HTMLInputElement;
  const registerNameInput = document.getElementById('registerNameInput')! as HTMLInputElement;
  const registerPasswordConfirmInput = document.getElementById('registerPasswordConfirmInput')! as HTMLInputElement;
  const registerError = document.getElementById('registerError')!;
  const registerSuccess = document.getElementById('registerSuccess')!;

  showLoginFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('d-none');
    registerForm.classList.add('d-none');
  });

  showRegisterFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('d-none');
    registerForm.classList.remove('d-none');
  });

  loginForm.addEventListener('submit', (e: SubmitEvent) => {
    handleLoginSubmit(e, loginEmailInput, loginPasswordInput, loginError);
  });

  registerForm.addEventListener('submit', (e) => {
    handleRegistrationSubmit(e, registerEmailInput, registerNameInput, registerPasswordInput, registerPasswordConfirmInput, registerError, registerSuccess, registerForm, loginForm);
  });
});
</script>

<template>
  <div class="login-form">
    <div class="d-flex">
      <div class="phone-presentation">
        <img src="../../assets/images/home-presentation.avif" alt="phone-presentation"/>
      </div>
      <div class="right-part">
        <div id="loginForm">
          <LoginForm/>
        </div>
        <div id="registerForm" class="d-none">
          <RegisterForm/>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center gap-3 flex-wrap mt-3">
      <a href="#" class="small text-light">Mentions légales</a>
      <a href="#" class="small text-light">Politique de confidentialité</a>
      <a href="#" class="small text-light">Conditions générales d'utilisation</a>
      <a href="https://sofianelasri.fr/" target="_blank" class="small text-light">2023 - Sofiane Lasri</a>
    </div>
  </div>
</template>