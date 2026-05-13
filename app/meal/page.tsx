"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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
    <main className="page-shell page-shell--top">
      <div className="page-card dashboard-layout page-card--left">
        <div className="page-card--center">
          <h1 className="page-title">Meal</h1>
          <p className="page-description">Track your meals here</p>
        </div>

        <div className="panel panel--left">
          <input
            type="text"
            placeholder="Meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="field"
          />

          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="field"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
              }
            }}
            className="field field--file"
          />

          <button
            type="button"
            onClick={addMeal}
            className="button button--primary"
          >
            Add Meal
          </button>
        </div>

        <div>
          <h2 className="section-heading">Saved meals</h2>
          <div className="stack-list">
            {meals.length === 0 ? (
              <p className="empty-state">No meals yet.</p>
            ) : (
              meals.map((meal) => (
                <div key={meal.id} className="item-card">
                  <p className="item-title">{meal.meal_name}</p>
                  <p className="item-meta">{meal.calories} calories</p>
                  {meal.image_url ? (
                    <a
                      href={meal.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="item-link"
                    >
                      View image
                    </a>
                  ) : null}

                  {meal.image_url && (
                    <img
                      src={meal.image_url}
                      alt="Meal"
                      className="item-image"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <Link
          href="/"
          className="back-link"
        >
          Back
        </Link>
      </div>
    </main>
  );
}
