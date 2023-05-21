import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [brandNameInput, setBrandNameInput] = useState("");
  const [brandDescriptionInput, setBrandDescriptionInput] = useState("");
  const [taglines, setTaglines] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: brandNameInput,
          brandDescription: brandDescriptionInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setTaglines(data.taglines);
      setBrandNameInput("");
      setBrandDescriptionInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Create Taglines</h3>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="brandName">Brand Name:</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              placeholder="Enter the brand name"
              value={brandNameInput}
              onChange={(e) => setBrandNameInput(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="brandDescription">Brand Description:</label>
            <input
              type="text"
              id="brandDescription"
              name="brandDescription"
              placeholder="Enter what the brand does"
              value={brandDescriptionInput}
              onChange={(e) => setBrandDescriptionInput(e.target.value)}
            />
          </div>
          <input type="submit" value="Generate Taglines" />
        </form>
        <div>
          {taglines.map((tagline, index) => (
            <p key={index}>{tagline}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
