"use client";

import React, { useState, useEffect } from "react";
import VistaMozo from "../components/Mozo";
import VistaCaja from "../components/Caja";
import { Utensils, Monitor } from "lucide-react";

// 🎯 TRUCO DE VENTA 1: Cambiá este nombre antes de entrar a la reunión con tu cliente
const NOMBRE_CLIENTE = "Cafetería Demo"; 

export type Pedido = {
  id: number;
  mesa: number;
  total: number;
  tiempo: string;
  items: string[];
};

export default function Home() {
  const [vista, setVista] = useState<"menu" | "mozo" | "caja">("menu");
  const [pedidosGlobales, setPedidosGlobales] = useState<Pedido[]>([]);
  const [cargado, setCargado] = useState(false);

  // 🎯 TRUCO DE VENTA 2: LocalStorage (Memoria anti-cortes de luz)
  // Carga los pedidos al abrir la página
  useEffect(() => {
    const pedidosGuardados = localStorage.getItem("sistemaPedidos_LV");
    if (pedidosGuardados) {
      setPedidosGlobales(JSON.parse(pedidosGuardados));
    }
    setCargado(true);
  }, []);

  // Guarda automáticamente cada vez que se suma o se borra un pedido
  useEffect(() => {
    if (cargado) {
      localStorage.setItem("sistemaPedidos_LV", JSON.stringify(pedidosGlobales));
    }
  }, [pedidosGlobales, cargado]);

  const handleNuevoPedido = (nuevo: Pedido) => setPedidosGlobales([...pedidosGlobales, nuevo]);
  const handleCompletarPedido = (id: number) => setPedidosGlobales(pedidosGlobales.filter((p) => p.id !== id));

  // Previene errores visuales mientras carga la memoria
  if (!cargado) return null; 

  if (vista === "mozo") return <VistaMozo onVolver={() => setVista("menu")} onEnviar={handleNuevoPedido} />;
  if (vista === "caja") return <VistaCaja onVolver={() => setVista("menu")} pedidos={pedidosGlobales} onCompletar={handleCompletarPedido} />;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-5xl md:text-6xl font-black text-emerald-400 mb-2 tracking-tight">{NOMBRE_CLIENTE}</h1>
        <p className="text-neutral-400 text-xl font-medium tracking-wide">Desarrollado por LV Tech</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button onClick={() => setVista("mozo")} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group shadow-xl">
          <div className="bg-neutral-950 p-6 rounded-full group-hover:scale-110 transition-transform">
            <Utensils className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mt-2">Punto Mozo</h2>
          <p className="text-neutral-500 text-center font-medium">Tomar pedidos desde el salón</p>
        </button>

        <button onClick={() => setVista("caja")} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group shadow-xl">
          <div className="bg-neutral-950 p-6 rounded-full group-hover:scale-110 transition-transform">
            <Monitor className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mt-2">Recepción / Caja</h2>
          <p className="text-neutral-500 text-center font-medium">
            {pedidosGlobales.length === 0 ? "Todo al día" : `${pedidosGlobales.length} comandas activas`}
          </p>
        </button>
      </div>
    </div>
  );
}