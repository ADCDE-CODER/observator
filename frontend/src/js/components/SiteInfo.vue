<script setup>
  import { computed } from 'vue';

  // Computed property to automatically get the current year.
  const currentYear = computed(() => new Date().getFullYear());
  const copyrightName = "ADCDE-CODER";
  const github = "https://github.com/ADCDE-CODER";
</script>

<template>
  <div class="container">
    <div class="info">
      <div class="link-list">
        <h4>Quick Links</h4>      
        <RouterLink class="link" to="#">About</RouterLink>
        <RouterLink class="link" to="#">Contact</RouterLink>
      </div>

      <div class="social-media">
        <h4>Social media</h4>
        <div class="social-icons">
          <a :href="github" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
        </div>
      </div>
    </div>

    <div class="copyright-info">
      © {{ currentYear }} {{ copyrightName }}. All Rights Reserved.
    </div>
  </div>
</template>

<style scoped>
  .container {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
    border-top: 1px var(--color-outline) solid; 
    padding: 0.1rem;
  }

  .info {
    display: flex;
    justify-content: space-evenly;
  }

  .link-list, .social-media {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h4 {
    color: var(--color-on-surface);
    margin: 10px 0px;
  }

  .link {
    color: var(--color-on-surface);
    text-decoration: none;
    display: block;
    padding: 5px 0;
  }

  .link:hover {
    color: var(--color-on-primary-container);
    text-decoration: underline;
  }

  .social-icons > a {
    background-color: var(--color-surface-container);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
    width: 40px;
    height: 40px;
    text-decoration: none;
    font-size: 1.2em;
  }

  .fa-brands:hover {
    opacity: 0.9;
  }

  .fa-github {
    background-color: transparent;
    color: var(--color-on-surface);
  }

  .copyright-info {
    margin-top: 10px;
    text-align: center;
  }
</style>