<script setup lang="ts">
import ProfileCard from "~@/components/components/Ui/ProfileCard.vue";
import defaultProfilePic from "~@/assets/images/square-logo-with-background.avif?url";
import {Message, UserPublicProfile} from "~@/types.ts";
import {onMounted, ref} from "vue";
import EmojiPicker from "~@/components/components/Ui/EmojiPicker.vue";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faImage, faSmile} from '@fortawesome/free-regular-svg-icons'
import {faBars, faMicrophone, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import ConversationBody from "~@/components/components/Conversation/ConversationBody.vue";
import {fetchApi, getJsonHeaders} from "~@/helpers.ts";
import apiConfig from '~@/config/apiConfig.ts';
import MessageInput from "~@/components/components/Conversation/MessageInput.vue";
import {io} from "socket.io-client";

const {serverBaseUrl, user: {getMessages, sendMessage}, attachment} = apiConfig;

library.add(faSmile, faImage, faMicrophone, faBars, faPaperPlane);

const props = defineProps<{
  targetUser: UserPublicProfile | null;
}>();

const emit = defineEmits<{
  (e: 'askedForOpeningSidebar'): void;
  (e: 'showFullProfileCard', user: UserPublicProfile): void;
}>();

// TODO : Faire de vrai conversations en base
const socketChannelName: string = (parseInt(localStorage.getItem("userId")!) + (props.targetUser ? props.targetUser.id : 0)).toString();

const socket = io(serverBaseUrl, {
  query: {channel: socketChannelName}
});

socket.on("connect", () => {
  console.log("Connected to server on channel " + socketChannelName);

  socket.on("message", (message) => {
    console.log(message.messageOject);
    messages.value.push(JSON.parse(message.messageOject));
    messageKey.value++;
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

const targetUserProfilePictureUrl = ref(defaultProfilePic);
const messages = ref<Message[]>([]);
const messageKey = ref(0);

onMounted(() => {
  if (props.targetUser) {
    handleConversationLogic();
    fetchMessages();
  }
});

function handleConversationLogic() {
  const openSidebarBtn: HTMLElement = document.getElementById("openSidebarBtn")!;
  const emojiPicker: HTMLElement = document.getElementById("emojiPicker")!;
  const pickEmojiBtn: HTMLElement = document.getElementById("pickEmojiBtn")!;

  openSidebarBtn.addEventListener("click", () => {
    emit("askedForOpeningSidebar");
  });

  pickEmojiBtn.addEventListener("click", () => {
    emojiPicker.classList.toggle("active");
  });

  targetUserProfilePictureUrl.value = props.targetUser!.profilePicture ? attachment + props.targetUser!.profilePicture : defaultProfilePic;
  console.log(attachment + props.targetUser!.profilePicture);
}

function insertEmoji(emoji: string): void {
  const messageInput: HTMLInputElement = document.getElementById("messageInput")! as HTMLInputElement;
  messageInput.value += emoji;
}

function fetchMessages(): void {
  fetchApi(getMessages + props.targetUser!.id, {
    method: 'GET',
    headers: getJsonHeaders(),
  }).then(response => {
    messages.value = response;
    messageKey.value = response.length;
  });
}

async function handleSendMessage(message: string) {
  if (props.targetUser) {
    const targetUserId = props.targetUser.id;
    const url = `${sendMessage}${targetUserId}`;
    const now: Date = new Date();
    const messageObject: Message = {
      id: 0,
      senderUserId: parseInt(localStorage.getItem("userId")!),
      receiverUserId: targetUserId,
      text: message,
      createdAt: now,
      updatedAt: now,
    }

    await fetchApi(url, {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify({message}),
    });

    socket.emit("message", {channel: socketChannelName, messageOject: JSON.stringify(messageObject)});

    fetchMessages();
  }
}
</script>

<template>
  <div id="conversationWrapper" v-if="props.targetUser">
    <div class="conversation-header">
      <button type="button" id="openSidebarBtn">
        <font-awesome-icon :icon="['fas', 'bars']"/>
      </button>
      <ProfileCard
          :id="props.targetUser.id"
          :username="props.targetUser.name"
          :avatar="targetUserProfilePictureUrl"
          :profile-picture="props.targetUser.profilePicture!"
          :status="props.targetUser.status"
          @profileClicked="emit('showFullProfileCard', props.targetUser)"
      />
    </div>
    <ConversationBody :messages="messages" :key="messageKey"/>
    <div class="conversation-footer">
      <div class="upper-popups">
        <EmojiPicker @insertEmoji="insertEmoji"/>
        <div class="popup" id="choosePicture">

        </div>
      </div>
      <button type="button" id="pickEmojiBtn">
        <font-awesome-icon :icon="['far', 'face-smile']"/>
      </button>
      <button type="button" id="sendPictureBtn">
        <font-awesome-icon :icon="['far', 'image']"/>
      </button>
      <MessageInput @sendMessage="handleSendMessage"/>
    </div>
  </div>

  <div id="noConversationWrapper" v-else
       class="no-conversation flex-grow-1 d-flex flex-column align-items-center justify-content-center text-white">
    <div class="content d-flex flex-column align-items-center justify-content-center text-center">
      <img src="../../../assets/images/logo.svg" alt="Métacafé logo" class="mb-2" style="width: 5rem; height: 5rem;"/>
      <h4>Bienvenue sur Métacafé !</h4>
      <p>Ici vous pouvez discuter avec des personnes ayant les mêmes centres d'intérêts que vous !</p>
    </div>
  </div>
</template>