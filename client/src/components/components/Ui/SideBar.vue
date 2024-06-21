<script setup lang="ts">
import ProfileCard from "~@/components/components/Ui/ProfileCard.vue";
import SearchZone from "~@/components/components/Ui/SearchZone/SearchZone.vue";
import defaultProfilePic from "~@/assets/images/square-logo-with-background.avif?url";
import {onMounted, ref} from "vue";
import {Activity, SearchZoneResult, UserPublicProfile} from "~@/types.ts";
import apiConfig from '~@/config/apiConfig.ts';
import {fetchApi, getAuthHeaders} from "~@/helpers.ts";

const {userApiUrl, user: {searchUser}} = apiConfig;

const props = defineProps<{
  cachedUsers: UserPublicProfile[];
  activities: Activity[];
}>();


const emit = defineEmits<{
  (e: 'profileClicked', user: UserPublicProfile): void
  (e: 'showFullProfileCard', user: UserPublicProfile): void
}>()

const sidebarRef = ref<HTMLElement | null>(null);

const serverBaseUrl: string = import.meta.env.VITE_BACKEND_URL as string;
const getAttachmentApiUrl = `${serverBaseUrl}/api/attachment/`;
const userProfilePictureUrl: string = localStorage.getItem("profilePictureUrl")!;
const userName: string = localStorage.getItem("username")!;
const userId: number = parseInt(localStorage.getItem("userId")!);

const acitivitiesSortedUsersList: UserPublicProfile[] = [];

props.activities.forEach((activity: Activity) => {
  let user: UserPublicProfile;

  user = props.cachedUsers.find((user: UserPublicProfile) => user.id === activity.userId)!;
  acitivitiesSortedUsersList.push(user);
});

onMounted(() => {
  const sidebar: HTMLElement | null = document.getElementById("sidebar");
  sidebarRef.value = sidebar;

  if (sidebar) {
    let touchStartX: number;
    let sidebarLeft: number;

    sidebar.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      sidebarLeft = sidebar.getBoundingClientRect().left;
    });

    sidebar.addEventListener("touchmove", (e) => {
      if (sidebar.classList.contains("mobile-fullwidth")) {
        return;
      }

      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;
      const newLeft = sidebarLeft + deltaX;

      if (newLeft <= 0) {
        sidebar.style.left = `${newLeft}px`;
      } else {
        sidebar.style.left = "0";
      }
    });

    sidebar.addEventListener("touchend", () => {
      const currentLeft = parseInt(sidebar.style.left || "0", 10);

      if (currentLeft <= -60) {
        sidebar.style.left = "-100%";

      } else {
        sidebar.style.left = "0";
      }
    });
  }
});

function profileClicked(user: UserPublicProfile) {
  emit("profileClicked", user);

  const profileElements: NodeListOf<HTMLElement> = document.querySelectorAll(".list-item");
  profileElements.forEach((element: HTMLElement) => {
    element.classList.remove("active");
  });

  const clickedProfileItem: HTMLElement | null = document.getElementById('friendProfile' + user.id.toString())!.parentElement as HTMLElement;
  if (clickedProfileItem) {
    clickedProfileItem.classList.add("active");
  }
}

function showFullProfileCard(clickedSearchResult: SearchZoneResult) {
  const userId: number = parseInt(clickedSearchResult.value);

  if(props.cachedUsers.some(user => user.id === userId)) {
    const user: UserPublicProfile = props.cachedUsers.find(user => user.id === userId)!;
    emit("showFullProfileCard", user);
  } else {
    fetchApi(`${userApiUrl}/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(user => {
      props.cachedUsers.push(user);
      emit("showFullProfileCard", user);
    });
  }
}

function askForSeingUserProfile(user: UserPublicProfile) {
  showFullProfileCard({
    name: user.name,
    value: user.id.toString()
  });
}
</script>

<template>
  <div id="sidebar" class="sidebar mobile-fullwidth">
    <div class="header">
      <div class="profile-card-header">
        <div class="background"></div>
        <ProfileCard
            :id="userId"
            :username="userName"
            :avatar="userProfilePictureUrl"
            :profilePicture="null"
            :action-text="`Voir le profil`"
            @actionClicked="askForSeingUserProfile" />
      </div>

      <SearchZone id="searchContact" :search-url="searchUser" class="p-2" placeholder="Rechercher un utilisateur"
                  @resultClick="showFullProfileCard" :clear-input-on-result-click="false" />
    </div>

    <div class="user-list">
      <div class="list-item" v-for="user in acitivitiesSortedUsersList" :key="user.id">
        <ProfileCard
            v-if="user.profilePicture !== null"
            element-id="friendProfile"
            :id="user.id"
            :username="`${user.name}`"
            :profilePicture="user.profilePicture!"
            :avatar="`${getAttachmentApiUrl}${user.profilePicture}`"
            :status="`${user.status}`"
            @profileClicked="profileClicked"
        />
        <ProfileCard
            v-else
            element-id="friendProfile"
            :id="user.id"
            :username="`${user.name}`"
            :profilePicture="user.profilePicture!"
            :avatar="`${defaultProfilePic}`"
            :status="`${user.status}`"
            @profileClicked="profileClicked"
        />
      </div>
    </div>

    <button class="disconnect-btn" id="disconnectBtn" @click="$router.push('logout')">Déconnexion</button>
  </div>
</template>

<style scoped>

</style>