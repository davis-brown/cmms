<template>
  <div class="auth-page">
    <v-card class="auth-card">
      <h1>Log in</h1>
      <p class="auth-lede">Welcome back. Log in to see the directory and calendar.</p>
      <form name="form" @submit.prevent="handleLogin" novalidate>
        <v-text-field
          v-model="user.username"
          label="Username"
          name="username"
          autocomplete="username"
          :error-messages="submitted && !user.username ? 'Username is required!' : ''"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          label="Password"
          name="password"
          type="password"
          autocomplete="current-password"
          :error-messages="submitted && !user.password ? 'Password is required!' : ''"
        ></v-text-field>
        <v-alert v-if="message" type="error" variant="tonal" class="alert-danger mb-4" role="alert">{{ message }}</v-alert>
        <v-btn type="submit" color="primary" size="large" block :loading="loading">Log in</v-btn>
      </form>
      <p class="auth-switch">New here? <router-link to="/register">Sign up</router-link></p>
    </v-card>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      submitted: false,
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleLogin() {
      this.submitted = true;
      if (!this.user.username || !this.user.password) {
        return;
      }
      this.loading = true;
      this.$store.dispatch('auth/login', this.user).then(
        () => {
          this.$router.push('/profile');
        },
        error => {
          this.loading = false;
          this.message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  }
};
</script>

