<script setup lang="ts">
import {library} from '@fortawesome/fontawesome-svg-core';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {UserPublicProfile} from "~@/types.ts";
import defaultProfilePic from "~@/assets/images/square-logo-with-background.avif?url";
import apiConfig from "~@/config/apiConfig.ts";

const {attachment} = apiConfig;

library.add(faXmark);

const props = defineProps<{
  user: UserPublicProfile
}>();

const emit = defineEmits<{
  (e: 'closeFullProfileCard'): void
  (e: 'sendMessageToUser', user: UserPublicProfile): void
}>()

const userId: number = parseInt(localStorage.getItem("userId")!);
const profilePictureUrl: string = props.user.profilePicture ? `${attachment}/${props.user.profilePicture}` : defaultProfilePic;

function sendMessageToUser() {
  emit("sendMessageToUser", props.user);
}
</script>

<template>
  <div class="full-profile-card-wrapper">
    <div class="full-profile-card">
      <div id="closeButton" class="close-button" @click="emit('closeFullProfileCard')"
           @touchstart="emit('closeFullProfileCard')">
        <font-awesome-icon :icon="['fas', 'xmark']"/>
      </div>

      <div class="header">
        <div class="profile-picture" :style="{'background-image': `url(${profilePictureUrl})`}"></div>
        <div class="profile-meta">
          <div class="d-flex flex-column gap-1">
            <div class="profile-name">
              {{ props.user.name }}
            </div>
            <div class="text-muted">
              {{ props.user.status }}
            </div>
          </div>

          <button type="button" v-if="props.user.id !== userId" @click="sendMessageToUser"
                  class="btn btn-primary">Envoyer un message
          </button>
        </div>
      </div>

      <h5>Centres d'intérêts</h5>
      <p>Work in progress</p>
    </div>
  </div>
</template>

<style scoped>

</style>