<script setup lang="ts">
import { usePizzaStore } from '../stores/PizzaStore';

const sizeOptions = {
  XSmall: 'X-Small (8 inches)',
  Small: 'Small (10 inches)',
  Medium: 'Medium (12 inches)',
  Large: 'Large (14 inches)',
};

const styleOptions = {
  Neapolitan: 'Neapolitan',
  NewYork: 'New York',
  Chicago: 'Chicago Deep Dish',
};

const doughOptions = {
  Regular: 'Regular',
  Sourdough: 'Sourdough',
};

const pizzaStore = usePizzaStore();

const updateCount = (event: Event) => {
  const count = parseInt((event.target as HTMLInputElement).value);
  pizzaStore.setCount(count);
};

const updateSize = (event: Event) => {
  pizzaStore.setSize((event.target as HTMLInputElement).value);
};

const updateStyle = (event: Event) => {
  pizzaStore.setStyle((event.target as HTMLInputElement).value);
};

const updateDough = (event: Event) => {
  pizzaStore.setDough((event.target as HTMLInputElement).value);
};

const count = pizzaStore.count;
const size = pizzaStore.size;
const style = pizzaStore.style;
const dough = pizzaStore.dough;
</script>

<template>
  <div id="pizzaForm">
    <h2>Craft your pizzas!</h2>
    <form action="#">
      <div class="form-selection">
        <label for="pizzaCount" class="form-label">
          <span>Pizzas</span>
          <input
            type="number"
            id="pizzaCount"
            class="form-input"
            v-model="count"
            min="1"
            @change="updateCount"
          />
        </label>
      </div>
      <div class="form-selection">
        <label for="size" class="form-label">
          <span>Size</span>
          <select
            name="size"
            id="size"
            class="form-input"
            v-model="size"
            @change="updateSize"
          >
            <option value="" selected disabled>Select an option...</option>
            <option
              v-for="(label, value) in sizeOptions"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-selection">
        <label for="style" class="form-label">
          <span>Style</span>
          <select
            id="style"
            class="form-input"
            v-model="style"
            @change="updateStyle"
          >
            <option value="" selected disabled>Select an option...</option>
            <option
              v-for="(label, value) in styleOptions"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </label>
      </div>
      <div class="form-selection">
        <label for="dough" class="form-label">
          <span>Dough</span>
          <select
            id="dough"
            class="form-input"
            v-model="dough"
            @change="updateDough"
          >
            <option value="" selected disabled>Select an option...</option>
            <option
              v-for="(label, value) in doughOptions"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </label>
      </div>
    </form>
  </div>
</template>
