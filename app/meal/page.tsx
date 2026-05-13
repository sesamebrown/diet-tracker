"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import styles from "./meal.module.css";

export default function MealPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function loadMeals() {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load meals:", error);
      return;
    }

    setMeals(data ?? []);
  }

  async function addMeal() {
    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error } = await supabase.storage
        .from("meal-images")
        .upload(fileName, image);

      if (error) {
        console.error("Image upload failed:", error);
        return;
      }

      if (!error) {
        imageUrl = supabase.storage
          .from("meal-images")
          .getPublicUrl(fileName)
          .data.publicUrl;
      }
    }

    const { error } = await supabase.from("meals").insert([
      {
        user_name: "",
        image_url: imageUrl,
        notes: "",
      },
    ]);

    if (error) {
      console.error("Failed to add meal:", error);
      return;
    }

    setMealName("");
    setCalories("");
    setImage(null);

    loadMeals();
  }

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Meal</h1>
        <p className={styles.description}>Track your meals here</p>

        <div className={styles.formCard}>
          <input
            type="text"
            placeholder="Meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className={styles.input}
          />

          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className={styles.input}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
              }
            }}
            className={styles.fileInput}
          />

          <button
            type="button"
            onClick={addMeal}
            className={styles.button}
          >
            Add Meal
          </button>
        </div>

        <div className={styles.savedMealsSection}>
          <h2 className={styles.savedMealsTitle}>Saved meals</h2>
          <div className={styles.savedMealsList}>
            {meals.length === 0 ? (
              <p className={styles.emptyState}>No meals yet.</p>
            ) : (
              meals.map((meal) => (
                <div key={meal.id} className={styles.mealCard}>
                  <p className={styles.mealName}>{meal.meal_name}</p>
                  <p className={styles.mealCalories}>{meal.calories} calories</p>
                  {meal.image_url ? (
                    <a
                      href={meal.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mealLink}
                    >
                      View image
                    </a>
                  ) : null}

                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt="Meal"
                      className={styles.mealImage}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <Link
          href="/"
          className={styles.backLink}
        >
          Back
        </Link>
      </div>
    </main>
  );
}
