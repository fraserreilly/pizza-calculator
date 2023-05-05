<script setup lang="ts">
import IngredientForm from './components/pizzaForm.vue';
import ingredientList from './components/ingredientList.vue';
import DarkModeSwitch from './components/darkModeSwitch.vue';
</script>

<template>
  <DarkModeSwitch></DarkModeSwitch>
  <IngredientForm></IngredientForm>
  <ingredientList></ingredientList>
</template>

<style>
html.dark {
  color-scheme: dark;
}
</style>
