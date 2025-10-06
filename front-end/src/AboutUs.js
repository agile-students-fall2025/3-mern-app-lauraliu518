import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5002";

export default function AboutUs() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/about`)
      .then((res) => {
        setData(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <main><p>Loading…</p></main>;
  if (status === "error") return <main><p>Could not load About data.</p></main>;

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>{data.title}</h1>
      <img src={data.imgURL}
        alt="Laura"
        style={{
        width: "250%",
        maxWidth: 150,
        height: "auto",
        display: "block",
        margin: "1rem auto",
        borderRadius: 12}}
      />
      {data.paragraphs?.map((p, i) => (
        <p key={i} style={{ lineHeight: 1.6 }}>{p}</p>
      ))}
    </main>
  );
}
