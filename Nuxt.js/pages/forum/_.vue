<!--
pages/<PATH PREFIX>/_.vue

We should process all nested routes,
so the page path for Nuxt.js should be
pages/<PATH PREFIX>/_.vue as described in https://nuxtjs.org/guide/routing/#unknown-dynamic-nested-routes
-->
<template>
  <div>
    <h1>Forum!</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error...</div>
    <div ref="peerboardContainer"></div>
  </div>
</template>

<script>
const pathPrefix = '<PATH_PREFIX>';
const boardId = '<BOARD ID>';

export default {

  data() {
    return {
      error: '',
      loading: true,
      forum: null,
    }
  },

  methods: {
    async createPeerBoard() {
      // If you are using Nuxt.js ssr you shouldn't create the forum during server-side rendering
      // You can use https://nuxtjs.org/faq/window-document-undefined/
      // or https://nuxtjs.org/api/components-client-only/
      if (!process.client) {
        return;
      }

      const { createForum } = require('@peerboard/core');     

      const options = {
        prefix: pathPrefix,

        // Recommended setting so that the forum container
        // will always occupy all available space
        minHeight: window.innerHeight,

        // Update your page title according to the forum state
        onTitleChanged: title =>
          window.document.title = 'Your title ' + title,

        onReady: () => {
          // Here you can safely any loading indicators
          this.loading = false;
        },

        onFail: () => {
          this.error = 'Failed to load forum...';
          this.loading = false;
        },
      };
      
      
      // Optional. Do this only if you want to implement seamless login https://community.peerboard.com/post/183197627?category=2097967386
      // Add auth token so the user will be authenticated when community is loaded
      options.jwtToken = await http.post('https://api.myapp.com/create-token-for-peerboard')

      this.forum = createForum(boardId, this.$refs.peerboardContainer, options)
    }
  },

  mounted() {
    this.createPeerBoard().catch(err => {
      console.error(err);
      this.error = 'Failed to load forum...'
    });
  },
  
  unmounted() {
    this.forum.destroy();
  }
}
</script>

