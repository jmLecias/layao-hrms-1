<template>
  <!-- Fullscreen overlay -->
  <div
    v-if="showPromo"
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >
    <div class="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white">
      <!-- Promo image -->
      <div class="relative h-[550px]">
        <transition name="fade" mode="out-in">
          <img
            :key="current"
            :src="promos[current].image"
            :alt="promos[current].title"
            class="w-full h-full object-cover"
          />
        </transition>

        <!-- Gradient overlay text -->
        <div
          class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-10"
        >
          <h2 class="text-white text-4xl font-bold drop-shadow-lg">
            {{ promos[current].title }}
          </h2>
          <p class="text-white/90 text-lg mt-3 drop-shadow-md max-w-2xl">
            {{ promos[current].description }}
          </p>
        </div>
      </div>

      <!-- Prev button -->
      <button
        @click="prevSlide"
        class="absolute cursor-pointer left-5 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#c4a164] hover:text-white transition"
      >
        <i class="fas fa-chevron-left text-xl"></i>
      </button>

      <!-- Next button -->
      <button
        @click="nextSlide"
        class="absolute right-5 cursor-pointer top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow hover:bg-[#c4a164] hover:text-white transition"
      >
        <i class="fas fa-chevron-right text-xl"></i>
      </button>

      <!-- Pagination dots -->
      <div class="absolute bottom-5 left-0 right-0 flex justify-center space-x-3">
        <button
          v-for="(promo, i) in promos"
          :key="i"
          @click="goToSlide(i)"
          class="w-3 h-3 rounded-full transition"
          :class="current === i ? 'bg-[#c4a164]' : 'bg-white/70 hover:bg-white'"
        ></button>
      </div>

      <!-- Close button -->
      <button
        @click="closePromo"
        class="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 hover:bg-white hover:shadow transition"
      >
        <i class="fas fa-xmark text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showPromo = ref(false)
const current = ref(0)
let timer = null

const promos = [
  {
    title: 'Escape to Paradise',
    description: 'Stay 3 nights and get the 4th night free.',
    image: 'https://picsum.photos/1200/550?random=1',
  },
  {
    title: 'Romantic Getaway',
    description: 'Enjoy a couples’ package with complimentary dinner by the beach.',
    image: 'https://picsum.photos/1200/550?random=2',
  },
  {
    title: 'Family Adventure',
    description: 'Kids stay free this summer holiday season.',
    image: 'https://picsum.photos/1200/550?random=3',
  },
]

function nextSlide() {
  current.value = (current.value + 1) % promos.length
  resetTimer()
}

function prevSlide() {
  current.value = (current.value - 1 + promos.length) % promos.length
  resetTimer()
}

function goToSlide(index) {
  current.value = index
  resetTimer()
}

function closePromo() {
  showPromo.value = false
  clearInterval(timer)
}

function startTimer() {
  clearInterval(timer)
  timer = setInterval(() => {
    current.value = (current.value + 1) % promos.length
  }, 5000) // auto-next every 5s
}

function resetTimer() {
  startTimer()
}

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10)
  const lastShown = localStorage.getItem('promoLastShown')

  if (lastShown !== today) {
    showPromo.value = true
    localStorage.setItem('promoLastShown', today)
    startTimer()
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
