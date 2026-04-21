'use client'

import { useState, useEffect } from 'react'
import { Heart, Clock, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export interface Recipe {
  id: string
  titulo: string
  descripcion: string
  imagen_url: string
  categoria: string
  created_at: string
}

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('favoritos')
        .select('id')
        .eq('recipe_id', recipe.id)
        .eq('user_id', user.id)
        .single()

      if (data) setIsFavorite(true)
    }
    checkFavorite()
  }, [recipe.id])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (loading) return

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Inicia sesión para guardar tus recetas favoritas.')
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        await supabase
          .from('favoritos')
          .delete()
          .eq('recipe_id', recipe.id)
          .eq('user_id', user.id)
        setIsFavorite(false)
      } else {
        await supabase
          .from('favoritos')
          .insert({ recipe_id: recipe.id, user_id: user.id })
        setIsFavorite(true)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 flex flex-col h-full">
      {/* Visual Header */}
      <div className="relative h-64 w-full overflow-hidden">
        {recipe.imagen_url ? (
          <img
            src={recipe.imagen_url}
            alt={recipe.titulo}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <Tag className="w-12 h-12 text-orange-200" />
          </div>
        )}

        {/* Favorite Overlay */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-5 right-5 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
            isFavorite 
              ? 'bg-orange-600 text-white' 
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-orange-600'
          }`}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-5 left-5">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm border border-orange-50">
            {recipe.categoria || 'Gourmet'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
          {recipe.titulo}
        </h3>
        
        <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-6 flex-grow">
          {recipe.descripcion || 'Una experiencia culinaria única preparada con los mejores ingredientes seleccionados.'}
        </p>

        {/* Card Footer */}
        <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-orange-200" />
            <span>{new Date(recipe.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
          </div>
          <span className="text-gray-300">Hardy Pro</span>
        </div>
      </div>
    </div>
  )
}
