<script setup lang="ts">
import {onMounted, ref} from 'vue';
import SideBar from '~@/components/components/SideBar.vue';
import Conversation from '~@/components/components/Conversation.vue';
import {UserPublicProfile, Activity} from '~@/types.ts';
import {fetchApi, getAuthHeaders} from '~@/helpers.ts';

const serverBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
const userApiUrl = `${serverBaseUrl}/api/user`;
const updateProfileApiUrl = `${userApiUrl}/me`;
const friendsApiUrl = `${updateProfileApiUrl}/friends`;
const activitiesApiUrl = `${updateProfileApiUrl}/activity`;

const allCachedUsers = ref<UserPublicProfile[]>([]);
const friends = ref<UserPublicProfile[]>([]);
const activities = ref<Activity[]>([]);
const isLoading = ref(0);

let currentConversation: UserPublicProfile | null = null;
const currentConversationKey = ref(0);

async function getFriends() {
  friends.value = await fetchApi(friendsApiUrl, {method: 'GET', headers: getAuthHeaders()});
  allCachedUsers.value.push(...friends.value.filter(friend => !allCachedUsers.value.some(user => user.id === friend.id)));
  isLoading.value++;
}

async function getActivities() {
  activities.value = await fetchApi(activitiesApiUrl, {method: 'GET', headers: getAuthHeaders()});
  for (const activity of activities.value) {
    if (!allCachedUsers.value.some(user => user.id === activity.targetUserId)) {
      const targetUser = await fetchApi(`${userApiUrl}/${activity.targetUserId}`, {
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
    const friend = friends.value.find(friend => friend.id === parseInt(userId));
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
                  :conversation="currentConversation"
                  :key="currentConversationKey"/>
  </div>
</template>

<style scoped>

</style>
