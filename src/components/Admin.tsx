"use client";

import React, { useState } from "react";
import { ArrowLeft, TrendingUp, Package, AlertTriangle, CheckCircle2 } from "lucide-react";

// Stock de prueba para el boceto
const STOCK_PRUEBA = [
  { id: 1, nombre: "Ojo de Bife", cantidad: 24, estado: "bien" },
  { id: 2, nombre: "Entraña", cantidad: 4, estado: "critico" },
  { id: 3, nombre: "Asado de Tira", cantidad: 15, estado: "bien" },
  { id: 4, nombre: "Papas Fritas (Porciones)", cantidad: 50, estado: "bien" },
  { id: 6, nombre: "Vino Malbec", cantidad: 2, estado: "critico" },
  { id: 7, nombre: "Cerveza Pinta (Barril)", cantidad: 120, estado: "bien" },
];

export default function VistaAdmin({ onVolver, ventasTotales }: { onVolver: () => void, ventasTotales: number }) {
  const [stock] = useState(STOCK_PRUEBA);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* ENCABEZADO */}
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-4">
        <button 
          onClick={onVolver}
          className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl transition-colors text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <TrendingUp className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-3xl font-black text-emerald-400 leading-tight">Panel de Control</h1>
          <p className="text-neutral-500 font-bold text-sm tracking-widest uppercase">Acceso Exclusivo Propietario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* COLUMNA IZQUIERDA: CONTABILIDAD */}
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-emerald-500/10">
              <TrendingUp className="w-40 h-40" />
            </div>
            <h2 className="text-neutral-400 font-bold uppercase tracking-widest text-sm mb-2">Recaudación del Día</h2>
            <p className="text-5xl font-black text-emerald-400 mb-4">${ventasTotales}</p>
            <div className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-500/30">
              Actualizado en tiempo real
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
             <h2 className="text-neutral-400 font-bold uppercase tracking-widest text-sm mb-4">Resumen de Cajas</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <span className="text-neutral-300">Efectivo</span>
                    <span className="font-bold text-white">${Math.floor(ventasTotales * 0.4)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <span className="text-neutral-300">Tarjetas / MercadoPago</span>
                    <span className="font-bold text-white">${Math.floor(ventasTotales * 0.6)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: STOCK */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Inventario en Tiempo Real</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {stock.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-neutral-950 p-4 rounded-2xl border border-neutral-800/50">
                <div className="flex items-center gap-4">
                  {item.estado === "critico" ? (
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg">{item.nombre}</p>
                    <p className={`text-sm font-bold ${item.estado === "critico" ? "text-red-400" : "text-neutral-500"}`}>
                      {item.estado === "critico" ? "¡Reponer urgente!" : "Stock óptimo"}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-neutral-500 font-bold uppercase mr-2">Quedan:</span>
                  <span className={`text-3xl font-black ${item.estado === "critico" ? "text-red-500" : "text-emerald-400"}`}>
                    {item.cantidad}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}