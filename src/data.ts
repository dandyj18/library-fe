export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  rating: number;
}

export const books: Book[] = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Improvement",
    year: 2018,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    year: 2008,
    rating: 4.7,
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    year: 2016,
    rating: 4.5,
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    year: 1999,
    rating: 4.8,
  },
  {
    id: 5,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Psychology",
    year: 2011,
    rating: 4.6,
  },
  {
    id: 6,
    title: "Ikigai",
    author: "Francesc Miralles",
    category: "Self Improvement",
    year: 2016,
    rating: 4.4,
  },
];
