<script>
export default {
  data() {
    return {
      newUser: {
        email: "",
        username: "",
        password: "",
      },
    };
  },
  methods: {},
};
</script>
<template>
  <h1>Ciao</h1>
  <form action="" method="post">
    <label for="email">Your email</label>
    <input
      type="email"
      id="email"
      name="user"
      placeholder="your@email.com"
    /><br />
    <label for="username">Username</label>
    <input type="text" id="username" name="user" placeholder="user" /><br />
    <label for="password">Password</label>
    <input type="password" id="password" name="user" /><br />
    <input type="submit" value="Submit" />
  </form>
</template>

<style lang="scss" scoped></style>
