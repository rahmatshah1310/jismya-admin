/* ProductFilters.tsx */
"use client";

import { useGetAllCategories, useGetSizes } from "@/app/api/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");

  const { data: categories } = useGetAllCategories();
  const { data: sizes } = useGetSizes();
  const categoriesall=categories?.data
  const sizesall=sizes?.data

  useEffect(() => {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (size) query.set("size", size);
    router.push(`/product?${query.toString()}`);
  }, [category, size]);

  return (
    <div className="flex items-center gap-4">
      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">All Categories</option>
        {categoriesall?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Size Filter */}
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">All Sizes</option>
        {sizesall?.map((sz) => (
          <option key={sz} value={sz}>
            {sz}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilters;
