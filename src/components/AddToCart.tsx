"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
export function AddToCart({ id, name }: { id: string; name: string }) {
  const { add, ready } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <div className="mt-7">
      <button
        disabled={!ready}
        className="btn btn-primary"
        onClick={() => {
          add(id);
          setAdded(true);
        }}
      >
        In winkelmandje +
      </button>
      {added && (
        <p role="status" className="text-sm mt-4 text-muted">
          {name} toegevoegd.{" "}
          <Link className="text-orange underline" href="/bumpr/mandje">
            Bekijk je mandje →
          </Link>
        </p>
      )}
    </div>
  );
}
