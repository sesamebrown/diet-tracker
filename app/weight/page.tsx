"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WeightPage() {
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        setError("Please log in to save weight data");
      }
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!weight || parseFloat(weight) <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      
      const { data, error: insertError } = await supabase
        .from("weight")
        .insert([
          {
            user_id: userId,
            date: today,
            weight: parseFloat(weight),
          },
        ]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess(true);
        setWeight("");
        setTimeout(() => setSuccess(false), 3000); // Clear success message after 3 seconds
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Weight</h1>
        <p className="page-description">{new Date().toLocaleDateString()}</p>
        
        <form className="weight-form" onSubmit={handleSubmit}>
          <label htmlFor="weight" className="form-label"></label>
          <input 
            type="number" 
            id="weight" 
            name="weight" 
            className="input form-input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            step="0.1"
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Weight saved successfully!</p>}

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <Link
          href="/"
          className="back-link"
        >
          Back
        </Link>
      </div>
    </main>
  )
}
