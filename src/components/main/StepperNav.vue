<template>
  <ul class="flex flex-row relative gap-x-2 mb-2">
    <li
      v-for="(items, index) in step"
      :key="index"
      class="flex items-center gap-x-2 shrink basis-0 flex-1 group"
    >
      <span class="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
        <span
          class="size-7 flex justify-center items-center flex-shrink-0 font-medium rounded-full"
          :class="currentStep == index || currentStep > index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'"
        >
          <CheckIcon v-if="currentStep > index" class="w-4 h-4" />
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span class="ms-2 text-sm font-medium text-gray-600">
          {{ items.label }}
        </span>
      </span>
      <div 
        class="w-16 h-px flex-1 group-last:hidden"
        :class="currentStep > index ? 'bg-blue-500' : 'bg-gray-200'"
      ></div>
    </li>
  </ul>
  <slot
    :name="`step(${currentKey})`"
  >
    {{ currentKey }}
  </slot>
  <div class="w-full flex items-center justify-between">
    <ButtonWithIcon
      color="red"
      :label="$t('label.back')"
      :disabled="currentStep == 0"
      @click="back()" />
    <ButtonWithIcon
      color="blue"
      :label="$t('label.next')"
      :disabled="(currentStep == (step.length - 1)) || !checkNextCondition()"
      @click="next()"
      v-if="currentStep != (step.length - 1)" />
    <ButtonWithIcon
      color="blue"
      :label="$t('label.submit')"
      @click="submit()"
      v-else />
  </div>
</template>

<script setup lang="ts">
import type IStep from '@/types/stepper'
import { CheckIcon } from '@heroicons/vue/24/solid'
import type { Ref } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import ButtonWithIcon from '../buttons/ButtonWithIcon.vue';

interface Props {
  step: IStep[]
}

const props = defineProps<Props>()
const emits = defineEmits<{
  nextStep: [step: number],
  submit: [done: boolean]
}>()

let currentStep: Ref<number> = ref(0)
let currentKey = computed<string>(() => {
  return props.step[currentStep.value].key
})

const next = () => {
  emits('nextStep', currentStep.value)
  currentStep.value++
}

const back = () => {
  currentStep.value--
}

const submit = () => {
  emits('submit', true)
}

const checkNextCondition = (): boolean => {
  if (props.step[currentStep.value].nextCondition !== undefined) {
    return props.step[currentStep.value].nextCondition!
  } else {
    return true
  }
}
</script>