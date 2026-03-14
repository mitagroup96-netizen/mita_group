import Books from "@/components/books/Books";
import { Hero } from "@/components/home/Hero";

const page = () => {
  return (
    <div>
      <Hero />
      <Books />
    </div>
  );
};

export default page;