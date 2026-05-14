"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WaterPage() {
  const [water, setWater] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        setError("Please log in to save water data");
      }
      setUserId(user?.id || null);
      setUsername(user?.user_metadata?.username || null);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!water || parseFloat(water) <= 0) {
      setError("Please enter a valid water intake");
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
        .from("water")
        .insert([
          {
            user_id: userId,
            user_name: username,
            date: today,
            water: parseFloat(water),
          },
        ]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess(true);
        setWater("");
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
        <h1 className="page-title">Water</h1>
        <p className="page-description">{new Date().toLocaleDateString()}</p>
        
        <form className="water-form" onSubmit={handleSubmit}>
          <label htmlFor="water" className="form-label"></label>
          <input 
            type="number" 
            id="water" 
            name="water" 
            className="input form-input"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            placeholder="Enter water intake"
            step="0.1"
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Water intake saved successfully!</p>}

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
