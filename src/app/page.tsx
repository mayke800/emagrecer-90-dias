'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogOut, Crown, TrendingDown, Calendar, Award } from 'lucide-react';
import RecipeCard from '@/components/custom/RecipeCard';
import PremiumModal from '@/components/custom/PremiumModal';
import { allRecipes, searchRecipes, getRandomRecipes } from '@/lib/recipes';
import { Recipe, User } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [clickedRecipesCount, setClickedRecipesCount] = useState(0);

  useEffect(() => {
    // Verifica se usuário está logado
    const userData = localStorage.getItem('slim90_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Carrega contador de receitas clicadas
    const count = parseInt(localStorage.getItem('slim90_clicked_recipes') || '0');
    setClickedRecipesCount(count);

    // Carrega receitas aleatórias iniciais
    setRecipes(getRandomRecipes(12));
  }, [router]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      // Realiza busca
      const results = searchRecipes(query);
      setRecipes(results);
    } else {
      setRecipes(getRandomRecipes(12));
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    // Incrementa contador de receitas clicadas
    const newCount = clickedRecipesCount + 1;
    setClickedRecipesCount(newCount);
    localStorage.setItem('slim90_clicked_recipes', newCount.toString());

    // Mostra modal premium após 2 cliques (antes da terceira)
    if (newCount >= 2 && !user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    // Abre detalhes da receita
    setSelectedRecipe(recipe);
  };

  const handleLogout = () => {
    localStorage.removeItem('slim90_user');
    localStorage.removeItem('slim90_clicked_recipes');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Slim90
                </h1>
                <p className="text-xs text-gray-500">Seu plano de 90 dias</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!user.isPremium && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  Premium
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Olá, {user.name}! 👋
            </h2>
            <p className="text-lg sm:text-xl text-orange-100 mb-6">
              Transforme seu corpo em 90 dias com receitas deliciosas
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">90</div>
                <div className="text-sm text-orange-100">Dias</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Award className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-orange-100">Receitas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.max(0, 2 - clickedRecipesCount)}</div>
                <div className="text-sm text-orange-100">Receitas Grátis</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar receitas... (ex: salada, frango, smoothie)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg"
                />
              </div>
              {!user.isPremium && clickedRecipesCount > 0 && (
                <p className="text-sm text-orange-100 mt-2">
                  {clickedRecipesCount}/2 receitas gratuitas visualizadas
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Receitas Recomendadas'}
          </h3>
          <p className="text-gray-600">
            {recipes.length} receitas encontradas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
            />
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhuma receita encontrada. Tente outra busca!
            </p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-700 rotate-180" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedRecipe.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedRecipe.category}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedRecipe.calories} kcal
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedRecipe.prepTime} min
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Ingredientes:</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Modo de Preparo:</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">Informações Nutricionais:</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{selectedRecipe.protein}g</div>
                    <div className="text-sm text-gray-600">Proteína</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedRecipe.carbs}g</div>
                    <div className="text-sm text-gray-600">Carboidratos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedRecipe.fat}g</div>
                    <div className="text-sm text-gray-600">Gorduras</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal - Bloqueante */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => {}} // Não permite fechar sem pagar
        userEmail={user.email}
        userName={user.name}
        userPhone={user.phone}
      />
    </div>
  );
}
