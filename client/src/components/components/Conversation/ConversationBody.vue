<script setup lang="ts">
import Message from "~@/components/components/Conversation/Message.vue";
import {Message as MessageType} from "~@/types.ts";
import {onMounted} from "vue";

const props = defineProps<{
  messages: MessageType[];
}>();

const userId: number = parseInt(localStorage.getItem("userId")!);

const allMessages: any = [];

props.messages.forEach(message => {
  let sender = "friend";
  if(message.senderUserId == userId) {
    sender = "me";
  }

  // parse createdAt to timestamp
  let timestamp = Date.parse(message.createdAt?.toString()!);
  allMessages.push({
    "sender": sender,
    "text": message.text,
    "timestamp": timestamp
  });
});

onMounted(() => {
  const scrollable = document.querySelector('.scrollable')!;
  const conversationBody = document.querySelector('.conversation-body')!;
  conversationBody.scrollTop = scrollable.scrollHeight;
});

</script>

<template>
  <div class="conversation-body">
    <div class="scrollable">
      <Message v-for="message in allMessages" :key="message.timestamp"
               :attachments="null" :sender="message.sender" :text="message.text" :timestamp="message.timestamp"/>
    </div>
  </div>
</template>

<style scoped>

</style>