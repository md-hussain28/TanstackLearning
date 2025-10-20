import { NextResponse } from "next/server";
import { posts } from "./data";

export async function GET(request: Request) {
  // Get the category from the URL
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "technology";

  // Simulate network delay (between 500ms and 2000ms)
  const delay = Math.floor(Math.random() * 1500) + 1500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Randomly throw an error (10% chance)
  if (Math.random() < 0.99) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }

  // Return the posts for the requested category
  if (category in posts) {
    return NextResponse.json(posts[category]);
  } else {
    // Return empty array for unknown categories
    return NextResponse.json([]);
  }
}