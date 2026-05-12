"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Minus, ShoppingCart, Send, Utensils } from "lucide-react";

// 🍖 MENÚ ENFOCADO EN CARNES / PARRILLA CON FOTOS
const MENU = [
  { id: 1, nombre: "Ojo de Bife", precio: 12500, cat: "Parrilla", imagen: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400&q=80" },
  { id: 2, nombre: "Entraña", precio: 11000, cat: "Parrilla", imagen: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80" },
  { id: 3, nombre: "Asado de Tira", precio: 9500, cat: "Parrilla", imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
  { id: 4, nombre: "Papas Fritas", precio: 4500, cat: "Guarnición", imagen: "https://images.unsplash.com/photo-1573082833947-d87179f74a39?w=400&q=80" },
  { id: 5, nombre: "Ensalada Mixta", precio: 3800, cat: "Guarnición", imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 6, nombre: "Vino Malbec", precio: 8500, cat: "Bebidas", imagen: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80" },
  { id: 7, nombre: "Cerveza Pinta", precio: 3500, cat: "Bebidas", imagen: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80" },
  { id: 8, nombre: "Flan con Mixto", precio: 3500, cat: "Postres", imagen: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=400&q=80" },
];

const CATEGORIAS = ["Todas", "Parrilla", "Guarnición", "Bebidas", "Postres"];

// 50 MESAS
const MESAS = Array.from({ length: 50 }, (_, i) => i + 1);

type ItemPedido = typeof MENU[0] & { cantidad: number };

export default function VistaMozo({ onVolver, onEnviar }: { onVolver: () => void; onEnviar: (p: any) => void }) {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(null);
  const [pedidoActual, setPedidoActual] = useState<ItemPedido[]>([]);
  const [filtro, setFiltro] = useState("Todas");

  const menuMostrado = filtro === "Todas" ? MENU : MENU.filter(prod => prod.cat === filtro);

  const agregarProducto = (producto: typeof MENU[0]) => {
    setPedidoActual((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) return prev.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const restarProducto = (id: number) => {
    setPedidoActual((prev) => {
      const existe = prev.find((item) => item.id === id);
      if (existe && existe.cantidad > 1) return prev.map((item) => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item);
      return prev.filter((item) => item.id !== id);
    });
  };

  const total = pedidoActual.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarPedido = () => {
    const pedidoTerminado = {
      id: Date.now(),
      mesa: mesaSeleccionada,
      total: total,
      tiempo: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      items: pedidoActual.map(item => `${item.cantidad}x ${item.nombre}`)
    };
    onEnviar(pedidoTerminado);
    setPedidoActual([]); 
    setMesaSeleccionada(null); 
  };

  if (mesaSeleccionada !== null) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setMesaSeleccionada(null)} className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-7 h-7" />
            </button>
            <h2 className="text-3xl font-black text-emerald-400">Mesa {mesaSeleccionada}</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
            {CATEGORIAS.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFiltro(cat)}
                className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filtro === cat ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRILLA DE PRODUCTOS CON FOTOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuMostrado.map((prod) => (
              <button 
                key={prod.id} 
                onClick={() => agregarProducto(prod)} 
                className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 rounded-3xl overflow-hidden transition-all active:scale-95 group flex flex-col text-left"
              >
                <div className="w-full h-40 overflow-hidden relative">
                    <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full text-emerald-400 font-black">
                        ${prod.precio}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-black text-lg leading-tight mb-1">{prod.nombre}</h3>
                    <span className="text-neutral-500 text-sm font-bold uppercase tracking-wider">{prod.cat}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* COMANDA */}
        <div className="md:w-96 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col h-[calc(100vh-3rem)] sticky top-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
            <h3 className="text-xl font-black text-emerald-400">Comanda Mesa {mesaSeleccionada}</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {pedidoActual.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                <Utensils className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-center font-medium">No hay productos seleccionados</p>
              </div>
            ) : (
              pedidoActual.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-neutral-950 p-3 rounded-2xl border border-neutral-800/50">
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.nombre}</p>
                    <p className="text-emerald-400 font-black text-sm">${item.precio * item.cantidad}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-1">
                    <button onClick={() => restarProducto(item.id)} className="p-2 hover:text-red-400 transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="font-black w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => agregarProducto(item)} className="p-2 hover:text-emerald-400 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400 font-bold uppercase text-xs tracking-widest">Total</span>
              <span className="text-4xl font-black text-emerald-400">${total}</span>
            </div>
            <button onClick={enviarPedido} disabled={pedidoActual.length === 0} className="w-full bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 hover:bg-emerald-400 text-neutral-950 font-black text-xl py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/10">
              <Send className="w-6 h-6" /> ENVIAR PEDIDO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="flex items-center justify-center gap-4 mb-10 relative max-w-6xl mx-auto">
        <button onClick={onVolver} className="absolute left-0 bg-neutral-900 hover:bg-neutral-800 p-3 rounded-2xl transition-colors text-neutral-400 hover:text-white">
          <ArrowLeft className="w-7 h-7" />
        </button>
        <h1 className="text-4xl font-black text-emerald-400">Seleccionar Mesa</h1>
      </div>
      
      {/* GRILLA DE 50 MESAS */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3 max-w-7xl mx-auto pb-10">
        {MESAS.map((num) => (
          <button 
            key={num} 
            onClick={() => setMesaSeleccionada(num)} 
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90 group"
          >
            <span className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter group-hover:text-neutral-300">Mesa</span>
            <span className="text-2xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{num}</span>
          </button>
        ))}
      </div>
    </div>
  );
}