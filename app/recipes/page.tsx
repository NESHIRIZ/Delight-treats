"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "../components/container";
import { LoadingSpinner } from "../components/loading";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert")
      .then(res => res.json())
      .then(data => {
        setRecipes(data.meals.slice(0, 10)); // Limit to 10
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="py-16">
        <Container>
          <LoadingSpinner />
        </Container>
      </main>
    );
  }

  return (
    <main className="py-16">
      <Container>
        <h1 className="mb-8 text-3xl font-bold">Dessert Recipes</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className="rounded-lg border bg-card p-4 shadow-sm">
              <Image
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                width={400}
                height={300}
                className="h-48 w-full rounded-md object-cover"
              />
              <h3 className="mt-4 font-semibold">{recipe.strMeal}</h3>
              <a
                href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
              >
                View Recipe
              </a>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}