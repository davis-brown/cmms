<template>
  <div class="auth-page">
    <v-card class="auth-card">
      <h1>Sign up</h1>
      <p class="auth-lede">Create an account. An admin approves new accounts before you can log in.</p>
      <form v-if="!successful" name="form" @submit.prevent="handleRegister" novalidate>
        <v-text-field
          v-model="user.username"
          label="Username"
          name="username"
          autocomplete="username"
          :error-messages="submitted ? errors.username : ''"
        ></v-text-field>
        <v-text-field
          v-model="user.email"
          label="Email"
          name="email"
          type="email"
          autocomplete="email"
          :error-messages="submitted ? errors.email : ''"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          label="Password"
          name="password"
          type="password"
          autocomplete="new-password"
          :error-messages="submitted ? errors.password : ''"
        ></v-text-field>
        <v-btn type="submit" color="primary" size="large" block>Sign up</v-btn>
      </form>
      <v-alert
        v-if="message"
        :type="successful ? 'success' : 'error'"
        variant="tonal"
        class="mt-4"
        :class="successful ? 'alert-success' : 'alert-danger'"
        role="alert"
      >{{ message }}</v-alert>
      <p class="auth-switch">Already have an account? <router-link to="/login">Log in</router-link></p>
    </v-card>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    // The message for each field, or "" when it's valid
    errors() {
      const { username, email, password } = this.user;
      const check = (value, field, min, max) =>
        !value ? `The ${field} field is required.` :
        value.length < min ? `The ${field} field must be at least ${min} characters.` :
        value.length > max ? `The ${field} field may not be greater than ${max} characters.` : '';
      return {
        username: check(username, 'username', 3, 20),
        email: check(email, 'email', 0, 50) || (/^\S+@\S+\.\S+$/.test(email) ? '' : 'The email field must be a valid email.'),
        password: check(password, 'password', 6, 40)
      };
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      if (Object.values(this.errors).some(Boolean)) {
        return;
      }
      this.$store.dispatch('auth/register', this.user).then(
        data => {
          this.message = data.message; 
          this.successful = true;
        },
        error => {
          this.message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
        }
      );
    }
  }
};
</script>

