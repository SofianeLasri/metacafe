<script setup lang="ts">
import Message from "~@/components/components/Conversation/Message.vue";
import {Message as MessageType} from "~@/types.ts";

const props = defineProps<{
  messages: MessageType[];
}>();

const userId: number = parseInt(localStorage.getItem("userId")!);

const allMessages: any = [];

props.messages.forEach(message => {
  let sender = "friend";
  console.log(userId);
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

</script>

<template>
  <div class="conversation-body">
    <!--        <Message :attachments="null" sender="me" text="Lorem ipsum dolor sit amet" :timestamp="1701510226"/>-->
<!--    <Message :attachments="null" sender="friend" text="Bienvenue sur Métacafé !" :timestamp="1702416035"/>-->
    <Message v-for="message in allMessages" :key="message.timestamp" :attachments="null" :sender="message.sender" :text="message.text" :timestamp="message.timestamp"/>
  </div>
</template>

<style scoped>

</style>