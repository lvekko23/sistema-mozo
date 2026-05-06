"use client";

import React from "react";
import { CheckCircle, Clock, ReceiptText, ArrowLeft } from "lucide-react";

// Ahora la caja recibe la lista de pedidos reales desde afuera
export default function VistaCaja({ onVolver, pedidos, onCompletar }: { onVolver: () => void; pedidos: any[]; onCompletar: (id: number) => void }) {
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-4">
        <button onClick={onVolver} className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl transition-colors text-neutral-400 hover:text-white">
          <ArrowLeft className="w-7 h-7" />
        </button>
        <ReceiptText className="w-8 h-8 text-emerald-400" />
        <h1 className="text-3xl font-black text-emerald-400">Caja / Recepción</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500 text-xl mt-10">
            No hay pedidos pendientes. ¡Todo al día!
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-emerald-500 text-neutral-950 font-black text-xl px-4 py-1 rounded-lg">
                  Mesa {pedido.mesa}
                </span>
                <span className="flex items-center gap-1 text-neutral-400 text-sm font-medium">
                  <Clock className="w-4 h-4" /> {pedido.tiempo}
                </span>
              </div>

              <div className="flex-1 bg-neutral-950 rounded-xl p-3 mb-4 space-y-2 border border-neutral-800/50">
                {pedido.items.map((item: string, idx: number) => (
                  <div key={idx} className="text-neutral-300 font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-end mt-auto">
                <div>
                  <p className="text-neutral-500 text-sm font-medium mb-1">Total a cobrar</p>
                  <p className="text-3xl font-black text-emerald-400">${pedido.total}</p>
                </div>
                <button
                  onClick={() => onCompletar(pedido.id)}
                  className="bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-400 p-3 rounded-xl transition-all flex items-center gap-2 font-bold group"
                >
                  <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden sm:inline">Listo</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}