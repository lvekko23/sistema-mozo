"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Minus, ShoppingCart, Send, Utensils, Coffee, CakeSlice, Beer } from "lucide-react";

// Menú categorizado
const MENU = [
  { id: 1, nombre: "Espresso", precio: 1500, cat: "Bebidas", icono: Coffee },
  { id: 2, nombre: "Coca Cola", precio: 2000, cat: "Bebidas", icono: Beer },
  { id: 3, nombre: "Pinta IPA", precio: 3500, cat: "Bebidas", icono: Beer },
  { id: 4, nombre: "Tostado J&Q", precio: 3500, cat: "Comidas", icono: Utensils },
  { id: 5, nombre: "Hamburguesa", precio: 7500, cat: "Comidas", icono: Utensils },
  { id: 6, nombre: "Porción Papas", precio: 4000, cat: "Comidas", icono: Utensils },
  { id: 7, nombre: "Chocotorta", precio: 4500, cat: "Postres", icono: CakeSlice },
  { id: 8, nombre: "Flan Mixto", precio: 3000, cat: "Postres", icono: CakeSlice },
];

const CATEGORIAS = ["Todas", "Bebidas", "Comidas", "Postres"];

// EL ARREGLO DE TYPESCRIPT: Un ItemPedido es igual al Menú, pero sumando la "cantidad"
type ItemPedido = typeof MENU[0] & { cantidad: number };

export default function VistaMozo({ onVolver, onEnviar }: { onVolver: () => void; onEnviar: (p: any) => void }) {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(null);
  const [pedidoActual, setPedidoActual] = useState<ItemPedido[]>([]);
  const [filtro, setFiltro] = useState("Todas");

  // Filtramos los productos según lo que toque el mozo
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

          {/* BARRA DE CATEGORÍAS */}
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

          {/* GRILLA DE PRODUCTOS */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {menuMostrado.map((prod) => {
              const Icono = prod.icono;
              return (
                <button key={prod.id} onClick={() => agregarProducto(prod)} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95">
                  <Icono className="w-8 h-8 text-neutral-500" />
                  <span className="font-bold text-center leading-tight">{prod.nombre}</span>
                  <span className="text-emerald-400 font-black">${prod.precio}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* COMANDA DERECHA */}
        <div className="md:w-96 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col h-[calc(100vh-3rem)] sticky top-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-black">Comanda Actual</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {pedidoActual.length === 0 ? (
              <p className="text-neutral-500 text-center mt-10">Agregá productos para la Mesa {mesaSeleccionada}</p>
            ) : (
              pedidoActual.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800/50">
                  <div className="flex-1">
                    <p className="font-bold text-sm truncate">{item.nombre}</p>
                    <p className="text-emerald-400 font-black text-sm">${item.precio * item.cantidad}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1">
                    <button onClick={() => restarProducto(item.id)} className="p-1 hover:text-red-400 transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => agregarProducto(item)} className="p-1 hover:text-emerald-400 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-neutral-800 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400 font-medium">Total a cobrar</span>
              <span className="text-3xl font-black text-emerald-400">${total}</span>
            </div>
            <button onClick={enviarPedido} disabled={pedidoActual.length === 0} className="w-full bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 hover:bg-emerald-400 text-neutral-950 font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
              <Send className="w-6 h-6" /> Enviar a Caja
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA INICIO MOZO
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="flex items-center justify-center gap-4 mb-10 relative max-w-4xl mx-auto">
        <button onClick={onVolver} className="absolute left-0 bg-neutral-900 hover:bg-neutral-800 p-3 rounded-2xl transition-colors text-neutral-400 hover:text-white">
          <ArrowLeft className="w-7 h-7" />
        </button>
        <h1 className="text-4xl font-black text-emerald-400">Seleccionar Mesa</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button key={num} onClick={() => setMesaSeleccionada(num)} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group shadow-lg">
            <span className="text-neutral-400 font-bold text-xl group-hover:text-neutral-300">Mesa</span>
            <span className="text-5xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{num}</span>
          </button>
        ))}
      </div>
    </div>
  );
}