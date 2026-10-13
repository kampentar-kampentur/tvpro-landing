import React from "react";
import EstimateClient from "./EstimateClient";

export const metadata = {
  title: "Get Your FREE TV Mounting Estimate | TVPro",
  description:
    "Get a fast, free estimate for professional TV mounting. 1 to 4+ TVs, all wall types, clean wire concealment & same-day service.",
  alternates: {
    canonical: "https://tvprousa.com/estimate",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EstimatePage() {
  return <EstimateClient />;
}
