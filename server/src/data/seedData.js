export const sampleUsers = [
  {
    name: 'Admin Master',
    email: 'admin@imovies.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 019-2834'
  },
  {
    name: 'Sarah Connor',
    email: 'user@imovies.com',
    password: 'user123',
    role: 'user',
    phone: '+1 (555) 382-9102'
  }
];

export const sampleTheatres = [
  {
    name: 'IMAX Grand Cinema',
    city: 'Metropolis',
    location: '452 Broadway Boulevard, Downtown',
    amenities: ['IMAX with Laser', 'Dolby Atmos 7.1', 'Recliner VIP Seats', 'Gourmet Dine-in', 'Valet Parking'],
    screens: [
      {
        screenNumber: 1,
        name: 'IMAX Screen 1',
        totalSeats: 60,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: 10,
          categoryRows: {
            vip: ['A'],
            premium: ['B', 'C'],
            regular: ['D', 'E', 'F']
          }
        }
      }
    ]
  },
  {
    name: 'Regal Royale Multiplex',
    city: 'Metropolis',
    location: '88 West Avenue, High Street Mall',
    amenities: ['4K Dual Laser Projection', 'Dolby Surround Sound', 'Snack Bar', 'Wheelchair Accessible'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 Luxe',
        totalSeats: 60,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: 10,
          categoryRows: {
            vip: ['A'],
            premium: ['B', 'C'],
            regular: ['D', 'E', 'F']
          }
        }
      }
    ]
  },
  {
    name: 'Starlight Cineplex',
    city: 'Gotham',
    location: '12 Cyber Way, Tech District',
    amenities: ['4DX Experience', '3D Enabled', 'Gaming Zone & Lounge'],
    screens: [
      {
        screenNumber: 1,
        name: 'Audi 3',
        totalSeats: 60,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F'],
          seatsPerRow: 10,
          categoryRows: {
            vip: ['A'],
            premium: ['B', 'C'],
            regular: ['D', 'E', 'F']
          }
        }
      }
    ]
  }
];

export const sampleMovies = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    rating: 8.8,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'now_showing'
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    rating: 8.9,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'now_showing'
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash on handling a new threat, Miles must redefine what it means to be a hero.',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    rating: 8.7,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'now_showing'
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    rating: 8.7,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'now_showing'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    rating: 9.0,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'now_showing'
  },
  {
    title: 'Cyberpunk: Neon Horizon',
    description: 'In the sprawling megacity of Neo-Veridia, a rogue neural hacker uncovers a sinister artificial intelligence conspiracy threatening humanity\'s collective consciousness.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'Japanese',
    duration: 135,
    releaseDate: new Date('2025-01-15'),
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    rating: 8.4,
    director: 'Kenji Sato',
    cast: ['Takeru Satoh', 'Rinko Kikuchi', 'Hiroyuki Sanada'],
    trailerUrl: '',
    status: 'now_showing'
  }
];
