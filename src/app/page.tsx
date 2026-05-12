"use client";

import React, { useState, useEffect } from "react";
import VistaMozo from "../components/Mozo";
import VistaCaja from "../components/Caja";
import VistaAdmin from "../components/Admin"; // Importamos el Admin
import { Utensils, Monitor, TrendingUp } from "lucide-react";

const NOMBRE_CLIENTE = "Bienvenido"; 

export type Pedido = {
  id: number;
  mesa: number;
  total: number;
  tiempo: string;
  items: string[];
};

export default function Home() {
  // Sumamos "admin" a las opciones de vista
  const [vista, setVista] = useState<"menu" | "mozo" | "caja" | "admin">("menu");
  const [pedidosGlobales, setPedidosGlobales] = useState<Pedido[]>([]);
  // Agregamos una alcancía para la recaudación
  const [ventasTotales, setVentasTotales] = useState(0);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const pedidosGuardados = localStorage.getItem("sistemaPedidos_Local");
    const ventasGuardadas = localStorage.getItem("sistemaVentas_Local");
    if (pedidosGuardados) setPedidosGlobales(JSON.parse(pedidosGuardados));
    if (ventasGuardadas) setVentasTotales(Number(ventasGuardadas));
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem("sistemaPedidos_Local", JSON.stringify(pedidosGlobales));
      localStorage.setItem("sistemaVentas_Local", ventasTotales.toString());
    }
  }, [pedidosGlobales, ventasTotales, cargado]);

  const handleNuevoPedido = (nuevo: Pedido) => setPedidosGlobales([...pedidosGlobales, nuevo]);
  
  // Cuando la caja cobra el pedido, se suma a la recaudación del dueño
  const handleCompletarPedido = (id: number) => {
    const pedidoCobrado = pedidosGlobales.find(p => p.id === id);
    if (pedidoCobrado) {
      setVentasTotales(prev => prev + pedidoCobrado.total);
    }
    setPedidosGlobales(pedidosGlobales.filter((p) => p.id !== id));
  };

  if (!cargado) return null; 

  if (vista === "mozo") return <VistaMozo onVolver={() => setVista("menu")} onEnviar={handleNuevoPedido} />;
  if (vista === "caja") return <VistaCaja onVolver={() => setVista("menu")} pedidos={pedidosGlobales} onCompletar={handleCompletarPedido} />;
  // Vista del nuevo panel de Admin
  if (vista === "admin") return <VistaAdmin onVolver={() => setVista("menu")} ventasTotales={ventasTotales} />;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-5xl md:text-6xl font-black text-emerald-400 mb-2 tracking-tight">{NOMBRE_CLIENTE}</h1>
        <p className="text-neutral-400 text-xl font-medium tracking-wide">Sistema de Gestión</p>
      </div>
      
      {/* Cambiamos la grilla para que entren los 3 botones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <button onClick={() => setVista("mozo")} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group shadow-xl">
          <div className="bg-neutral-950 p-5 rounded-full group-hover:scale-110 transition-transform">
            <Utensils className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mt-2">Punto Mozo</h2>
          <p className="text-neutral-500 text-center font-medium">Tomar pedidos</p>
        </button>

        <button onClick={() => setVista("caja")} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group shadow-xl">
          <div className="bg-neutral-950 p-5 rounded-full group-hover:scale-110 transition-transform">
            <Monitor className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mt-2">Recepción / Caja</h2>
          <p className="text-neutral-500 text-center font-medium">
            {pedidosGlobales.length === 0 ? "Todo al día" : `${pedidosGlobales.length} comandas`}
          </p>
        </button>

        {/* NUEVO BOTÓN DE ADMIN */}
        <button onClick={() => setVista("admin")} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
            PROPIETARIO
          </div>
          <div className="bg-neutral-950 p-5 rounded-full group-hover:scale-110 transition-transform">
            <TrendingUp className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mt-2 text-center">Stock y Reportes</h2>
          <p className="text-neutral-500 text-center font-medium">Ver recaudación en vivo</p>
        </button>
      </div>
    </div>
  );
}