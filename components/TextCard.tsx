import React from "react";
import Link from "next/link";

type Props = {
  id: number | string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  createdByName?: string | null;
};

export default function TextCard({ id, title, category, excerpt, createdByName }: Props) {
  return (
    <article style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 8px 0" }}>
        {/* jangan masukkan <a> child */}
        <Link href={`/texts/${id}`} style={{ color: "#0b5fff", textDecoration: "none" }}>
          {title}
        </Link>
      </h3>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        {category && <span style={{ marginRight: 12 }}>Kategori: {category}</span>}
        {createdByName && <span>Oleh: {createdByName}</span>}
      </div>
      <p style={{ margin: 0, color: "#333" }}>{excerpt ?? ""}</p>
    </article>
  );
}
