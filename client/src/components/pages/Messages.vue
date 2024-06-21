<script setup lang="ts">
import {onMounted, ref} from 'vue';
import SideBar from '~@/components/components/Ui/SideBar.vue';
import Conversation from '~@/components/components/Conversation/Conversation.vue';
import {UserPublicProfile, Activity} from '~@/types.ts';
import {fetchApi, getAuthHeaders} from '~@/helpers.ts';
import apiConfig from '~@/config/apiConfig.ts';

const {userApiUrl, friends, activity} = apiConfig;

const allCachedUsers = ref<UserPublicProfile[]>([]);
const friendsList = ref<UserPublicProfile[]>([]);
const activities = ref<Activity[]>([]);
const isLoading = ref(0);

let currentConversation: UserPublicProfile | null = null;
const currentConversationKey = ref(0);

async function getFriends() {
  friendsList.value = await fetchApi(friends, {method: 'GET', headers: getAuthHeaders()});
  allCachedUsers.value.push(...friendsList.value.filter(friend => !allCachedUsers.value.some(user => user.id === friend.id)));
  isLoading.value++;
}

async function getActivities() {
  activities.value = await fetchApi(activity, {method: 'GET', headers: getAuthHeaders()});
  for (const activity of activities.value) {
    if (!allCachedUsers.value.some(user => user.id === activity.userId)) {
      const targetUser = await fetchApi(`${userApiUrl}/${activity.userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      allCachedUsers.value.push(targetUser);
    }
  }
  isLoading.value++;
}

function getCachedUserPublicProfile(userId: number): UserPublicProfile | null {
  return allCachedUsers.value.find(user => user.id === userId) || null;
}

onMounted(async () => {
  await Promise.all([getFriends(), getActivities()]);
  initConversation();
});

function initConversation() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  if (userId) {
    const friend = friendsList.value.find(friend => friend.id === parseInt(userId));
    if (friend) {
      loadConversation(friend);
    } else {
      fetchApi(`${userApiUrl}/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      }).then(user => loadConversation(user));
    }
  }
}

function loadConversation(user: UserPublicProfile) {
  currentConversation = user;
  currentConversationKey.value++;
  const url = new URL(window.location.href);
  url.searchParams.set('userId', user.id.toString());
  window.history.pushState({}, '', url.toString());

  const sidebar = document.getElementById('sidebar')!;
  sidebar.classList.toggle('mobile-fullwidth', !currentConversation);
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar')!;
  sidebar.style.left = '0';
}
</script>

<template>
  <div class="messages-app">
    <SideBar v-if="isLoading == 2" :users="allCachedUsers" :activities="activities" @profileClicked="loadConversation"/>
    <Conversation @askedForOpeningSidebar="openSidebar"
                  :targetUser="currentConversation"
                  :key="currentConversationKey"/>
  </div>
</template>

<style scoped>

</style>
