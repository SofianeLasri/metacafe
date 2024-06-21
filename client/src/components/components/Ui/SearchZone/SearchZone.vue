<script setup lang="ts">
import {library} from '@fortawesome/fontawesome-svg-core';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {App, createApp, onMounted, ref} from "vue";
import SimpleResult from "~@/components/components/Ui/SearchZone/SimpleResult.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {SearchZoneResult} from "~@/types.ts";
import ResultWithAttachment from "~@/components/components/Ui/SearchZone/ResultWithAttachment.vue";

const props = defineProps<{
  id: string;
  placeholder: string;
  searchUrl: string;
  clearInputOnResultClick: boolean;
}>();

const emit = defineEmits<{
  (e: 'resultClick', result: SearchZoneResult): void
}>()

library.add(faMagnifyingGlass);

const searchInputId: string = props.id + "SearchInput";
const searchResultsId: string = props.id + "SearchResults";
const results = ref<Array<SearchZoneResult>>([]);
const resultKeys = ref<number>(0);

onMounted(() => {
  const searchZone: HTMLElement = document.getElementById(props.id)! as HTMLElement;
  const searchInput: HTMLInputElement = document.getElementById(searchInputId)! as HTMLInputElement;
  const searchResults: HTMLElement = document.getElementById(searchResultsId)! as HTMLElement;

  const handleClickOutside = (event: Event) => {
    if (!searchZone.contains(event.target as Node) || searchResults.contains(event.target as Node)) {
      searchResults.classList.add("d-none");
    }
  };

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  searchInput.addEventListener("keyup", () => {
    fetch(props.searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        search: searchInput.value
      })
    }).then(async (response) => {
      if (response.ok) {
        const responseJson = await response.json();
        results.value = responseJson;
        resultKeys.value++;
        showResults(responseJson);
      } else {
        const isResponseJson = response.headers.get("content-type")?.includes("application/json");
        if (isResponseJson) {
          const responseJson = await response.json();
          console.log(responseJson);
        } else {
          console.log("Une erreur est survenue");
        }
      }
    });
  });

  function showResults(results: Array<SearchZoneResult>) {
    if (results.length === 0) {
      searchResults.classList.add("d-none");
      return;
    }
    searchResults.classList.remove("d-none");
  }
});

function resultClick(result: SearchZoneResult) {
  emit("resultClick", result);
  if (props.clearInputOnResultClick) {
    const searchInput: HTMLInputElement = document.getElementById(searchInputId)! as HTMLInputElement;
    searchInput.value = "";
  }
}
</script>

<template>
  <div :id="id" class="search-zone">
    <div class="search-bar">
      <div class="icon-prepend">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
      </div>
      <input :id="searchInputId" type="text" :placeholder="placeholder">
    </div>
    <div :id="searchResultsId" class="results d-none">
      <template v-for="result in results" :key="resultKeys">
        <ResultWithAttachment v-if="result.attachment" :name="result.name" :value="result.value"
                              :attachment="result.attachment" @resultClicked="resultClick"/>
        <SimpleResult v-else :name="result.name" :value="result.value" @resultClicked="resultClick"/>
      </template>

    </div>
  </div>
</template>

<style scoped>

</style>