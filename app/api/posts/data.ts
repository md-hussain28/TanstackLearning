export type Post = {
  id: number;
  title: string;
  body: string;
};

export type PostsData = {
  [category: string]: Post[];
};

export const posts: PostsData = {
  technology: [
    { id: 1, title: 'Introduction to React', body: 'React is a JavaScript library for building user interfaces.' },
    { id: 2, title: 'Getting Started with TypeScript', body: 'TypeScript is a typed superset of JavaScript.' },
    { id: 3, title: 'Next.js Fundamentals', body: 'Next.js is a React framework for production.' },
  ],
  design: [
    { id: 4, title: 'UI Design Principles', body: 'Good UI design focuses on simplicity and clarity.' },
    { id: 5, title: 'Color Theory Basics', body: 'Understanding color is crucial for effective design.' },
  ],
  productivity: [
    { id: 6, title: 'Time Management Techniques', body: 'Effective time management leads to increased productivity.' },
    { id: 7, title: 'Goal Setting Strategies', body: 'Setting SMART goals is key to achieving your objectives.' },
    { id: 8, title: 'Building Positive Habits', body: 'Habits form the foundation of long-term success.' },
  ],
}; 