'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import RecipeCard, { Recipe } from '@/components/RecipeCard'
import { Search, Loader2, Filter } from 'lucide-react'

export default function Home() {
  const [recetas, setRecetas] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [loading, setLoading] = useState(true)

  const categorias = ['Todas', 'Pescado', 'Pollo', 'Postres', 'Carnes', 'Vegano']

  useEffect(() => {
    async function fetchRecetas() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('recetas')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setRecetas(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecetas()
  }, [])

  const filteredRecetas = recetas.filter((r) => {
    const matchesSearch = r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'Todas' || r.categoria?.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter">
            Comida Especial <span className="text-orange-600 drop-shadow-sm">Hardy</span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12">
            Explora el arte culinario a través de nuestra selección premium de recetas.
          </p>

          {/* Buscador y Filtros */}
          <div className="flex flex-col space-y-8">
            <div className="relative max-w-2xl mx-auto w-full group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="¿Qué quieres cocinar hoy?"
                className="block w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-orange-900/5 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-xl font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categorías */}
            <div className="flex flex-wrap justify-center gap-3">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                      : 'bg-white text-gray-400 hover:text-orange-600 border border-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid Principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando Recetario...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredRecetas.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            
            {filteredRecetas.length === 0 && (
              <div className="col-span-full py-40 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 text-xl font-medium">No se encontraron recetas.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveCategory('Todas')}}
                  className="mt-4 text-orange-600 font-bold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-gray-100 bg-white">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          HARDY PRO • RECETARIO EXCLUSIVO © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
