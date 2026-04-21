'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import RecipeCard, { Recipe } from '@/components/RecipeCard'
import { Search, Loader2, Utensils } from 'lucide-react'

export default function Home() {
  const [recetas, setRecetas] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecetas() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('recetas')
          .select('id, titulo, descripcion, imagen_url, categoria, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setRecetas(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecetas()
  }, [])

  // Real-time filtering logic
  const filteredRecetas = recetas.filter((receta) => {
    const search = searchTerm.toLowerCase()
    return (
      receta.titulo.toLowerCase().includes(search) ||
      (receta.categoria && receta.categoria.toLowerCase().includes(search))
    )
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
      <p className="text-gray-500 font-semibold tracking-wide">Preparando tu cocina...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50/30 p-6 md:p-12 lg:p-16">
      {/* Branding & Hero */}
      <section className="mb-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center justify-center p-2 px-4 mb-6 bg-orange-50 rounded-full border border-orange-100">
          <Utensils className="w-4 h-4 text-orange-600 mr-2" />
          <span className="text-orange-600 text-xs font-bold uppercase tracking-widest">Recetario Pro v1.0</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter">
          Comida Especial <span className="text-orange-600 drop-shadow-sm">Hardy</span>
        </h1>
        
        <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
          La mejor selección de recetas exclusivas para elevar tu experiencia culinaria diaria.
        </p>

        {/* Search Input */}
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-7 w-7 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="¿Qué quieres cocinar hoy?"
            className="block w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-orange-900/5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/20 outline-none transition-all text-xl placeholder:text-gray-400 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Recipes Feed */}
      <div className="max-w-[1400px] mx-auto">
        {error && (
          <div className="bg-red-50 text-red-700 p-8 rounded-3xl mb-12 text-center border border-red-100 font-bold shadow-sm">
            Ocurrió un error en la conexión: {error}
          </div>
        )}

        {filteredRecetas.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[48px] border-2 border-dashed border-gray-100 shadow-sm">
            <div className="mb-6 flex justify-center opacity-20">
              <Search className="w-24 h-24 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {searchTerm ? "Sin resultados" : "Cocina vacía"}
            </h3>
            <p className="text-gray-400 text-lg">
              {searchTerm 
                ? `No encontramos coincidencias para "${searchTerm}"` 
                : "Aún no has agregado recetas a tu base de datos."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredRecetas.map((receta) => (
              <RecipeCard key={receta.id} recipe={receta} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-32 py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 font-bold tracking-tighter uppercase text-sm">
          Desarrollado con ❤️ para Hardy • {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  )
}
