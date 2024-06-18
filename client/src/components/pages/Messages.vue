<script setup lang="ts">
import SideBar from "~@/components/components/SideBar.vue";
import {onMounted, ref} from "vue";
import {UserPublicProfile, Activity} from "~@/types.ts";
import Conversation from "~@/components/components/Conversation.vue";

const serverBaseUrl: string = import.meta.env.VITE_BACKEND_URL as string;
const userApiUrl: string = `${serverBaseUrl}/api/user`;
const updateProfileApiUrl: string = `${userApiUrl}/me`;
const friendsApiUrl: string = `${updateProfileApiUrl}/friends`;
const activitiesApiUrl: string = `${updateProfileApiUrl}/activity`;

const allCachedUsers = ref<UserPublicProfile[]>([]);
const friends = ref<UserPublicProfile[]>([]);
const activities = ref<Activity[]>([]);
const isLoading = ref(0);

let currentConversation: UserPublicProfile | null = null;
let currentConversationKey = ref(0);

function getFriends() {
  fetch(friendsApiUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  }).then(async (response) => {
    if (response.status === 200) {
      friends.value = await response.json();
      isLoading.value++;

      for (const friend of friends.value) {
        if (!allCachedUsers.value.some((otherUser) => otherUser.id === friend.id)) {
          allCachedUsers.value.push(friend);
        }
      }
    } else {
      const isResponseJson = response.headers.get("content-type")?.includes("application/json");
      if (isResponseJson) {
        const responseJson = await response.json();
        console.error(responseJson.message);
      } else {
        console.error("Une erreur est survenue");
      }
    }
  });
}

function getActivities() {
  fetch(activitiesApiUrl, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  }).then(async (response) => {
    if (response.status === 200) {
      activities.value = await response.json();
      isLoading.value++;

      for (const activity of activities.value) {
        if (!allCachedUsers.value.some((user) => user.id === activity.targetUserId)) {
          let targetUser: UserPublicProfile | null = await getUserPublicProfile(activity.targetUserId);
          if (targetUser) {
            allCachedUsers.value.push(targetUser);
          }
        }
      }
    } else {
      const isResponseJson = response.headers.get("content-type")?.includes("application/json");
      if (isResponseJson) {
        const responseJson = await response.json();
        console.error(responseJson.message);
      } else {
        console.error("Une erreur est survenue");
      }
    }
  });
}

async function getUserPublicProfile(userId: number): Promise<UserPublicProfile | null> {
  let user: UserPublicProfile | null = null;

  let promise = fetch(userApiUrl + "/" + userId, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  }).then(async (response) => {
    if (response.status === 200) {
      user = await response.json();
    } else {
      const isResponseJson = response.headers.get("content-type")?.includes("application/json");
      if (isResponseJson) {
        const responseJson = await response.json();
        console.error(responseJson.message);
      } else {
        console.error("Une erreur est survenue");
      }
    }
  });

  await promise;
  return user;
}

onMounted(() => {
  getFriends();
  getActivities();
  initConversation();

  function initConversation() {
    // On regarde si on a un paramètre userId dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      if (friends.value.length > 0) {
        // On cherche l'utilisateur dans la liste des amis
        const friend = friends.value.find((friend) => friend.id === parseInt(userId!));

        if (friend) {
          // Si on a trouvé l'utilisateur, on affiche la conversation
          loadConversation(friend);
        } else {
          fetch(userApiUrl + "/" + userId, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          }).then(async (response) => {
            if (response.status === 200) {
              const user: UserPublicProfile = await response.json();
              loadConversation(user);
            } else {
              const isResponseJson = response.headers.get("content-type")?.includes("application/json");
              if (isResponseJson) {
                const responseJson = await response.json();
                console.error(responseJson.message);
              } else {
                console.error("Une erreur est survenue");
              }
            }
          });
        }
      }
    }
  }
});

function loadConversation(user: UserPublicProfile) {
  console.log("Loading conversation with user: ", user);
  currentConversation = user;
  currentConversationKey.value++;
}

function openSidebar(): void {
  const sidebar: HTMLElement = document.getElementById("sidebar")!;
  sidebar.style.left = "0";
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
