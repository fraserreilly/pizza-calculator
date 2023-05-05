<script setup lang="ts">
import { usePizzaStore } from '../stores/PizzaStore';
import { computed, ref } from 'vue';

interface Recipe {
  Flour: number;
  Water: number;
  Yeast?: number;
  Starter?: number;
  Salt: number;
  Sugar: number;
  Oil: number;
  [key: string]: number | any;
}

interface Recipes {
  [recipeName: string]: Recipe;
}

interface Ingredient {
  name?: string;
  grams?: number;
  macros: {
    carbs: number;
    fats: number;
    protein: number;
  };
  calories: number;
}

interface IngredientInformation {
  [ingredientName: string]: Ingredient;
}

const pizzaStore = usePizzaStore();

const toggleMacros = ref(false);

const ingredientInformation: IngredientInformation = {
  Flour: {
    grams: 1,
    macros: { carbs: 0.75, fats: 0.014, protein: 0.13 },
    calories: 3.547,
  },
  Water: {
    grams: 1,
    macros: { carbs: 0, fats: 0, protein: 0 },
    calories: 0,
  },
  Starter: {
    grams: 1,
    macros: { carbs: 0.375, fats: 0.007, protein: 0.065 },
    calories: 1.774,
  },
  Yeast: {
    grams: 1,
    macros: { carbs: 0.457, fats: 0, protein: 0.343 },
    calories: 3.14,
  },
  Salt: {
    grams: 1,
    macros: { carbs: 0, fats: 0, protein: 0 },
    calories: 0,
  },
  Sugar: {
    grams: 1,
    macros: { carbs: 1, fats: 0, protein: 0 },
    calories: 3.87,
  },
  Oil: {
    grams: 1,
    macros: { carbs: 0, fats: 1, protein: 0 },
    calories: 9,
  },
};

const pizzaRecipes: Recipes = {
  newyork: {
    Flour: 210,
    Water: 140,
    Yeast: 3.5,
    Salt: 3.5,
    Sugar: 5,
    Oil: 10.5,
  },
  neapolitan: {
    Flour: 210,
    Water: 135,
    Yeast: 3.5,
    Salt: 4.5,
    Sugar: 0,
    Oil: 0,
  },
  chicago: {
    Flour: 200,
    Water: 137,
    Yeast: 3.5,
    Salt: 5,
    Sugar: 0,
    Oil: 4,
  },
};

const adjustDough = (dough: string, recipe: Recipe) => {
  if (dough === 'sourdough') {
    const starter = Math.round(recipe.Flour * 0.334);
    const flour = Math.round(recipe.Flour - starter / 2);
    const water = Math.round(recipe.Water - starter / 2);

    return {
      Flour: flour,
      Water: water,
      Starter: starter,
      Salt: recipe.Salt,
      Sugar: recipe.Sugar,
      Oil: recipe.Oil,
    };
  } else {
    return recipe;
  }
};

const adjustSize = (size: string) => {
  let sizeMultiplier;
  switch (size) {
    case 'xsmall':
      sizeMultiplier = 0.555;
      break;
    case 'small':
      sizeMultiplier = 0.694;
      break;
    case 'large':
      sizeMultiplier = 1.362;
      break;
    default:
      sizeMultiplier = 1;
  }

  return sizeMultiplier;
};

const computedRecipe = computed(() => {
  const style = pizzaStore.style.toLowerCase();

  const size = pizzaStore.size.toLowerCase();
  const dough = pizzaStore.dough.toLowerCase();

  const adjustedDough: Recipe = adjustDough(dough, pizzaRecipes[style]);
  const sizeMultiplier = adjustSize(size);

  const adjustedRecipe: Recipe = {
    Flour: 0,
    Water: 0,
    Salt: 0,
    Sugar: 0,
    Oil: 0,
  };

  for (let i in adjustedDough) {
    adjustedRecipe[i] = +(
      adjustedDough[i] *
      sizeMultiplier *
      pizzaStore.count
    ).toFixed(1);
  }

  return adjustedRecipe;
});

const computedMacrosAndCalories = computed(() => {
  const macrosAndCalories: IngredientInformation = {};
  const recipe = computedRecipe.value;

  Object.entries(recipe).forEach(([name, grams]) => {
    const ingredient: Ingredient = ingredientInformation[name];
    macrosAndCalories[name] = {
      name,
      macros: {
        carbs: ingredient.macros.carbs * grams,
        fats: ingredient.macros.fats * grams,
        protein: ingredient.macros.protein * grams,
      },
      calories: ingredient.calories * grams,
    };
  });

  const totalMacros = { carbs: 0, fats: 0, protein: 0 };
  let totalCalories = 0;
  Object.values(macrosAndCalories).forEach((ingredient: Ingredient) => {
    if (ingredient.macros) {
      totalMacros.carbs += ingredient.macros.carbs;
      totalMacros.fats += ingredient.macros.fats;
      totalMacros.protein += ingredient.macros.protein;
    }
    if (ingredient.calories) {
      totalCalories += ingredient.calories;
    }
  });

  return {
    macrosAndCalories,
    totalMacros,
    totalCalories,
  };
});
</script>

<template>
  <div
    v-if="
      pizzaStore.dough &&
      pizzaStore.size &&
      pizzaStore.style &&
      pizzaStore.count
    "
  >
    <div id="ingredientsList">
      <h2>Ingredients:</h2>
      <ul>
        <li v-for="(ingredient, name) in computedRecipe" :key="name">
          <span>{{ name }}:</span> <span>{{ ingredient }}g</span>
        </li>
      </ul>
    </div>
    <button class="macros-toggle" @click="toggleMacros = !toggleMacros">
      Show macros & calories...
    </button>
    <div id="calorieList" v-if="toggleMacros">
      <h2>Macros and calories:</h2>
      <ul>
        <li
          v-for="(
            ingredient, name
          ) in computedMacrosAndCalories.macrosAndCalories"
          :key="name"
        >
          <span>{{ name }}:</span>
          <span>
            Carbs: {{ ingredient.macros.carbs.toFixed(1) }}g, Fats:
            {{ ingredient.macros.fats.toFixed(1) }}g, Protein:
            {{ ingredient.macros.protein.toFixed(1) }}g
          </span>
        </li>
      </ul>
      <h3>
        <span>Total macros:</span>
        <span>
          Carbs: {{ computedMacrosAndCalories.totalMacros.carbs.toFixed(1) }}g,
          Fats: {{ computedMacrosAndCalories.totalMacros.fats.toFixed(1) }}g,
          Protein:
          {{ computedMacrosAndCalories.totalMacros.protein.toFixed(1) }}g
        </span>
      </h3>
      <h3>
        <span>Total calories: </span>
        <span
          >{{ computedMacrosAndCalories.totalCalories.toFixed(1) }}kcal</span
        >
      </h3>
    </div>
  </div>
</template>
