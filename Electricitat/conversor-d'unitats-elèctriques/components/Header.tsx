import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-md py-4">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Conversor d'Unitats Elèctriques
        </h1>
        <p className="text-cyan-400 mt-2">Aprèn i practica les conversions de magnituds elèctriques</p>
      </div>
    </header>
  );
};

export default Header;