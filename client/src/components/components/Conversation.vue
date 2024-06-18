<script setup lang="ts">
import ProfileCard from "~@/components/components/ProfileCard.vue";
import Message from "~@/components/components/Message.vue";
import profilePic from "~@/assets/images/square-logo-with-background.avif?url";
import {UserPublicProfile} from "~@/types.ts";
import {onMounted} from "vue";
import EmojiPicker from "~@/components/components/EmojiPicker.vue";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faSmile, faImage} from '@fortawesome/free-regular-svg-icons'
import {faMicrophone, faBars, faPaperPlane} from "@fortawesome/free-solid-svg-icons";

library.add(faSmile, faImage, faMicrophone, faBars, faPaperPlane);

const props = defineProps<{
  conversation: UserPublicProfile | null;
}>()

const emit = defineEmits<{
  (e: 'askedForOpeningSidebar'): void
}>()



onMounted(() => {
  if(props.conversation) {
    handleConversationLogic();
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
}

function insertEmoji(emoji: string): void {
  const messageInput: HTMLInputElement = document.getElementById("messageInput")! as HTMLInputElement;
  messageInput.value += emoji;
}

</script>

<template>
  <div id="conversationWrapper" v-if="props.conversation">
    <div class="conversation-header">
      <button type="button" id="openSidebarBtn">
        <font-awesome-icon :icon="['fas', 'bars']"/>
      </button>
      <ProfileCard
          :id="1"
          :username="`Métacafé`"
          :avatar="profilePic"
          :status="`En ligne`"
      />
    </div>
    <div class="conversation-body">
      <!--        <Message :attachments="null" sender="me" text="Lorem ipsum dolor sit amet" :timestamp="1701510226"/>-->
      <Message :attachments="null" sender="friend" text="Bienvenue sur Métacafé !" :timestamp="1702416035"/>
    </div>
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
      <input id="messageInput" type="text" placeholder="Tapez votre message ici">
      <button type="button" id="openSidebarBtn">
        <font-awesome-icon :icon="['fas', 'paper-plane']"/>
      </button>
    </div>
  </div>

  <div id="noConversationWrapper" v-else
       class="no-conversation flex-grow-1 d-flex flex-column align-items-center justify-content-center text-white">
    <div class="content d-flex flex-column align-items-center justify-content-center text-center">
      <img src="../../assets/images/logo.svg" alt="Métacafé logo" class="mb-2" style="width: 5rem; height: 5rem;"/>
      <h4>Bienvenue sur Métacafé !</h4>
      <p>Ici vous pouvez discuter avec des personnes ayant les mêmes centres d'intérêts que vous !</p>
    </div>
  </div>
</template>