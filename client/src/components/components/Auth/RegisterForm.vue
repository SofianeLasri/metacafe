<script setup lang="ts">

</script>

<template>
  <div class="logo">
    <img src="../../../assets/images/Logo-Large-White.avif" alt="logo"/>
  </div>
  <form class="form" data-form-type="register">
    <h4>Créer un compte</h4>
    <div id="registerError" class="alert alert-danger d-none">
      Erreur lors de la création du compte
    </div>

    <div class="my-3">
      <div class="mb-3">
        <label for="registerEmailInput" class="form-label">Adresse e-mail</label>
        <input type="email" class="form-control" id="registerEmailInput" data-form-type="email" name="email"
               placeholder="gordon.freeman@blackmesa.us" required>
      </div>
      <div class="mb-3">
        <label for="registerPasswordInput" class="form-label">Mot de passe</label>
        <input type="password" class="form-control mb-2" id="registerPasswordInput" data-form-type="password" name="password"
               placeholder="Mot de passe" required>
        <input type="password" class="form-control" id="registerPasswordConfirmInput" data-form-type="password"
               name="registerPasswordConfirm" placeholder="Confirmer le mot de passe" required>
      </div>
      <div class="mb-3">
        <label for="registerNameInput" class="form-label">Nom d'utilisateur</label>
        <input type="text" class="form-control" id="registerNameInput" data-form-type="username" name="name"
               placeholder="Gordon Freeman" required>
      </div>
    </div>

    <button type="submit" class="btn btn-primary">S'inscrire</button>
    <div class="mt-3 d-flex flex-column text-center">
      <a href="#" class="small text-muted">Mot de passe oublié ?</a>
    </div>
  </form>

  <div class="form align-items-center">
    <span>Vous possédez déjà un compte ?</span>
    <a id="showLoginFormLink" href="#" class="fw-bold">Connectez-vous</a>
  </div>
</template>

<style scoped>

</style>