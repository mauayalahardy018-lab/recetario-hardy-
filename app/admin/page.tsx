'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { Plus, Trash2, Edit, Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recetas, setRecetas] = useState<any[]>([])
  const [newRecipe, setNewRecipe] = useState({ titulo: '', categoria: '', descripcion: '', imagen_url: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        fetchRecetas()
      } else {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  async function fetchRecetas() {
    const { data } = await supabase.from('recetas').select('*').order('created_at', { ascending: false })
    setRecetas(data || [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await supabase.from('recetas').insert([newRecipe])
    if (!error) {
      setNewRecipe({ titulo: '', categoria: '', descripcion: '', imagen_url: '' })
      fetchRecetas()
    }
    setIsSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta receta?')) {
      await supabase.from('recetas').delete().eq('id', id)
      fetchRecetas()
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
    </div>
  )

  if (!session) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-black mb-4">Acceso Denegado</h1>
      <p className="text-gray-500 mb-8">Debes iniciar sesión con GitHub para acceder al modo desarrollador.</p>
      <Link href="/" className="flex items-center text-orange-600 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a la Home
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Panel de <span className="text-orange-600 underline decoration-8 decoration-orange-100 underline-offset-4">Control</span></h1>
            <p className="text-gray-500 font-medium mt-2">Gestiona el inventario de recetas exclusivas.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Desarrollador:</span>
            <p className="font-bold text-gray-900">{session.user.user_metadata.full_name}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario de Creación */}
          <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-orange-900/5 border border-gray-100">
            <h2 className="text-xl font-black mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-orange-600" />
              Nueva Receta
            </h2>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Título</label>
                <input 
                  required
                  value={newRecipe.titulo}
                  onChange={e => setNewRecipe({...newRecipe, titulo: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                  placeholder="Ej: Salmón Glaseado"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Categoría</label>
                <select 
                  value={newRecipe.categoria}
                  onChange={e => setNewRecipe({...newRecipe, categoria: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Pescado">Pescado</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Postres">Postres</option>
                  <option value="Carnes">Carnes</option>
                  <option value="Vegano">Vegano</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Imagen URL</label>
                <input 
                  value={newRecipe.imagen_url}
                  onChange={e => setNewRecipe({...newRecipe, imagen_url: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                  placeholder="https://images.unsplash..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Descripción</label>
                <textarea 
                  value={newRecipe.descripcion}
                  onChange={e => setNewRecipe({...newRecipe, descripcion: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none transition-all h-32 resize-none" 
                  placeholder="Breve descripción..."
                />
              </div>
              
              <button 
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Receta'}
              </button>
            </form>
          </div>

          {/* Listado de Gestión */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black mb-6 px-4">Inventario Actual ({recetas.length})</h2>
            
            {recetas.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-lg shadow-gray-200/20 flex items-center justify-between group hover:border-orange-200 transition-all">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                    <img src={r.imagen_url || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md">{r.categoria}</span>
                    <h3 className="text-lg font-black text-gray-900 mt-1">{r.titulo}</h3>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(r.id)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {recetas.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay recetas registradas.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
