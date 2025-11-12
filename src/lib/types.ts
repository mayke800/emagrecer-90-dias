// Tipos do Slim90

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  isPremium: boolean;
  searchCount: number;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  calories: number;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  ingredients: string[];
  instructions: string[];
  image: string;
  tags: string[];
  protein: number;
  carbs: number;
  fat: number;
}

export interface SearchFilters {
  category?: string;
  maxCalories?: number;
  difficulty?: string;
  tags?: string[];
}
