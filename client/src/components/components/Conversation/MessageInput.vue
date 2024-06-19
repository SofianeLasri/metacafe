<script setup lang="ts">
import {library} from '@fortawesome/fontawesome-svg-core'
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {ref, defineEmits} from 'vue';

library.add(faPaperPlane);

const message = ref('');
const emit = defineEmits(['sendMessage']);

function sendMessage() {
  if (message.value.trim() !== '') {
    emit('sendMessage', message.value);
    message.value = '';
  }
}
</script>

<template>
  <input
      id="messageInput"
      type="text"
      placeholder="Tapez votre message ici"
      v-model="message"
      @keyup.enter="sendMessage"
  />
  <button type="button" id="sendMessageBtn" @click="sendMessage">
    <font-awesome-icon :icon="['fas', 'paper-plane']"/>
  </button>
</template>