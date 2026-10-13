import BookNowClient from "./BookNowClient";

export const metadata = {
  title: "Get a Quick Quote | TVPro Handy Services",
  description:
    "Leave your number — we’ll call and give you the exact price for professional TV mounting and installation.",
  alternates: {
    canonical: "https://tvprousa.com/book-now/",
  },
};

export default function BookNowPage() {
  return <BookNowClient />;
}
