<script setup lang="ts">
import {EmojiDataByGroup} from "~@/types.ts";
import {onMounted} from "vue";
import emojiByGroup from "unicode-emoji-json/data-by-group.json";

const emit = defineEmits<{
  (e: 'insertEmoji', emoji: string): void
}>()

const emojiDataByGroup: EmojiDataByGroup = JSON.parse(JSON.stringify(emojiByGroup));

onMounted(() => {
  const emojiListContainer: HTMLElement = document.getElementById("emojiListContainer")!;

  createEmojiGroupsDomElements(emojiDataByGroup, emojiListContainer);
});

function createEmojiGroupsDomElements(emojiData: EmojiDataByGroup, emojiListContainer: HTMLElement): void {
  for (const group in emojiData) {
    const groupDomElement = document.createElement("div");
    groupDomElement.classList.add("group");

    const groupTitleDomElement = document.createElement("div");
    groupTitleDomElement.classList.add("subtitle");
    groupTitleDomElement.innerText = group;

    const groupEmojisDomElement = document.createElement("div");
    groupEmojisDomElement.classList.add("emojis");

    for (const emoji in emojiData[group]) {
      const emojiDomElement = document.createElement("div");
      let emojiString: string = emojiData[group][emoji].emoji;
      emojiDomElement.classList.add("emoji");
      emojiDomElement.dataset.type = "emoji";
      emojiDomElement.innerText = emojiString;

      groupEmojisDomElement.appendChild(emojiDomElement);

      emojiDomElement.addEventListener("click", () => {
        emit("insertEmoji", emojiString);
      });
    }

    groupDomElement.appendChild(groupTitleDomElement);
    groupDomElement.appendChild(groupEmojisDomElement);
    emojiListContainer.appendChild(groupDomElement);
  }
}
</script>

<template>
  <div class="popup" id="emojiPicker">
    <div class="fw-bold">
      Choisir un emoji
    </div>
    <div id="emojiListContainer"></div>
  </div>
</template>