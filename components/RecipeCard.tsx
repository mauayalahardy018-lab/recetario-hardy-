'use client'

import { useState, useEffect } from 'react'
import { Heart, Clock, ArrowRight } from 'lucide-react'

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

  // Cargar estado de favoritos desde LocalStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('hardy_favorites') || '[]')
    setIsFavorite(favorites.includes(recipe.id))
  }, [recipe.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('hardy_favorites') || '[]')
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== recipe.id)
    } else {
      newFavorites = [...favorites, recipe.id]
    }

    localStorage.setItem('hardy_favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        {recipe.imagen_url ? (
          <img
            src={recipe.imagen_url}
            alt={recipe.titulo}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center font-bold text-orange-200 italic">
            Sin Imagen
          </div>
        )}
        
        {/* Overlay de Categoría */}
        <div className="absolute top-6 left-6">
          <span className="px-5 py-2.5 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm border border-orange-50/50">
            {recipe.categoria || 'Gourmet'}
          </span>
        </div>

        {/* Botón de Favorito Local */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-6 right-6 p-3.5 rounded-2xl transition-all duration-300 ${
            isFavorite 
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' 
              : 'bg-white/80 backdrop-blur-md text-gray-400 hover:text-orange-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
          {recipe.titulo}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {recipe.descripcion || 'Exclusiva selección de ingredientes frescos preparados con maestría culinaria.'}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 mr-2 text-orange-300" />
            <span>{new Date(recipe.created_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}</span>
          </div>
          
          <button className="text-orange-600 p-2 hover:bg-orange-50 rounded-xl transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
