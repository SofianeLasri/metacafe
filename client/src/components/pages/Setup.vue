<script setup lang="ts">
import {createApp, onMounted, ref} from 'vue';
import router from '~@/router.ts';
import SearchZone from '~@/components/components/SearchZone.vue';
import InteractiveBadge from '~@/components/components/InteractiveBadge.vue';
import defaultProfilePic from '~@/assets/images/square-logo-with-background.avif?url';
import {fetchApi, getAuthHeaders, getJsonHeaders} from '~@/helpers.ts';
import {CenterOfInterest} from "~@/types.ts";

const serverBaseUrl = import.meta.env.VITE_BACKEND_URL as string;
const updateProfileApiUrl = `${serverBaseUrl}/api/user/me`;
const updateProfilePicApiUrl = `${updateProfileApiUrl}/updateProfilePic`;
const userCentersOfInterestApiUrl = `${updateProfileApiUrl}/centersOfInterest`;
const getAttachmentApiUrl = `${serverBaseUrl}/api/attachment/`;
const getCentersOfInterestApiUrl = `${serverBaseUrl}/api/centerOfInterest`;
const matchCenterOfInterestApiUrl = `${getCentersOfInterestApiUrl}/matchByName`;

const userProfilePictureUrl = ref<string>(localStorage.getItem('profilePictureUrl') || defaultProfilePic);
const centersOfInterest = ref<CenterOfInterest[]>([]);
const centersList = ref<HTMLElement | null>(null);

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const responseJson = await fetchApi(updateProfilePicApiUrl, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
      });

      const newProfilePictureUrl = getAttachmentApiUrl + responseJson.profilePicture;
      localStorage.setItem('profilePictureUrl', newProfilePictureUrl);
      userProfilePictureUrl.value = newProfilePictureUrl;

      document.getElementById('profilePicture')!.style.backgroundImage = `url(${userProfilePictureUrl.value})`;
      showFinishButton(true);
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

function showFinishButton(confirm = false) {
  if (userProfilePictureUrl.value === defaultProfilePic && !confirm) {
    return;
  }
  document.getElementById('denyPpBtn')!.classList.add('d-none');
  document.getElementById('laterPpBtn')!.classList.add('d-none');
  document.getElementById('finishPpBtn')!.classList.remove('d-none');
}

async function finishSetup() {
  try {
    await fetchApi(updateProfileApiUrl, {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify({hasSeenIntro: true}),
    });
    window.location.href = router.resolve({name: 'messages'}).href;
  } catch (error: any) {
    console.error(error.message);
  }
}

async function getCentersOfInterest() {
  try {
    centersOfInterest.value = await fetchApi(userCentersOfInterestApiUrl, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    centersOfInterest.value.forEach(addCenterOfInterest);
  } catch (error: any) {
    console.error(error.message);
  }
}

function addCenterOfInterest(centerOfInterest: HTMLElement | CenterOfInterest) {
  const centerOfInterestId = centerOfInterest instanceof HTMLElement ? parseInt(centerOfInterest.dataset.value!) : centerOfInterest.id;
  const centerOfInterestName = centerOfInterest instanceof HTMLElement ? centerOfInterest.dataset.text! : centerOfInterest.name;

  centersOfInterest.value.push({id: centerOfInterestId, name: centerOfInterestName});

  const tempDiv = document.createElement('div');
  const badgeVueComponent = createApp({extends: InteractiveBadge}, {
    text: centerOfInterestName,
    id: `centerOfInterest-${centerOfInterestId}`,
  });

  badgeVueComponent.mount(tempDiv);

  const closeBtn = tempDiv.firstElementChild!.querySelector('.btn-close')!;
  closeBtn.addEventListener('click', () => removeCenterOfInterest(centerOfInterestId));

  centersList.value!.appendChild(tempDiv.firstElementChild!);

  if (centersOfInterest.value.length >= 3) {
    document.getElementById('nextBtn')!.classList.remove('d-none');
  }
}

function removeCenterOfInterest(centerOfInterestId: number) {
  const centerOfInterestElement = document.getElementById(`centerOfInterest-${centerOfInterestId}`)!;
  centerOfInterestElement.remove();

  centersOfInterest.value = centersOfInterest.value.filter(center => center.id !== centerOfInterestId);

  if (centersOfInterest.value.length < 3) {
    document.getElementById('nextBtn')!.classList.add('d-none');
  }
}

async function handleNext() {
  try {
    await fetchApi(userCentersOfInterestApiUrl, {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({
        centersOfInterest: centersOfInterest.value.map(center => center.id),
      }),
    });
    showProfilePicturePopup();
  } catch (error: any) {
    console.error(error.message);
  }
}

function showProfilePicturePopup() {
  document.getElementById('setCenterOfInterestsPopup')!.classList.add('d-none');
  showFinishButton();
  document.getElementById('setProfilePicturePopup')!.classList.remove('d-none');
}

onMounted(() => {
  const profilePicture = document.getElementById('profilePicture')!;
  const denyPpBtn = document.getElementById('denyPpBtn')! as HTMLButtonElement;
  const laterPpBtn = document.getElementById('laterPpBtn')! as HTMLButtonElement;
  const finishPpBtn = document.getElementById('finishPpBtn')! as HTMLButtonElement;
  const nextBtn = document.getElementById('nextBtn')! as HTMLButtonElement;
  centersList.value = document.getElementById('centersList')!;

  getCentersOfInterest();

  profilePicture.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
  });

  denyPpBtn.addEventListener('click', finishSetup);
  laterPpBtn.addEventListener('click', () => window.location.href = router.resolve({name: 'messages'}).href);
  finishPpBtn.addEventListener('click', finishSetup);
  nextBtn.addEventListener('click', handleNext);
});
</script>

<template>
  <div id="setProfilePicturePopup" class="popup-card d-none">
    <div id="profilePicture" class="profile-picture"
         :style="{'background-image': `url(${userProfilePictureUrl})`}"></div>

    <div class="content mt-5">
      <h4>Personnalisons votre profil</h4>
      <p>Envoyez une image pour aider les autres à mieux vous reconnaitre.</p>
    </div>

    <div class="actions">
      <button id="denyPpBtn" type="button" class="negative">Non</button>
      <button id="laterPpBtn" type="button" class="neutral">Plus-tard</button>
      <button id="finishPpBtn" type="button" class="positive d-none">Terminé !</button>
    </div>
  </div>
  <div id="setCenterOfInterestsPopup" class="popup-card align-items-start">
    <div class="content">
      <h4>Qu'est-ce qui vous passionne ?</h4>
      <div class="mt-3">
        <SearchZone id="searchBar" :search-url="matchCenterOfInterestApiUrl" :clear-input-on-result-click="true"
                    placeholder="Rechercher un centre d'intérêt" @resultClick="addCenterOfInterest"/>
        <p class="text-muted small mt-1">Choisissez au moins 3 centres d'intérêt.</p>
      </div>

      <div id="centersList" class="d-flex flex-wrap gap-2"></div>
    </div>

    <div class="actions">
      <button id="nextBtn" type="button" class="neutral d-none">Suivant</button>
    </div>
  </div>
</template>