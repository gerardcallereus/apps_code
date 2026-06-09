import React, { useMemo } from 'react';
import { BuildingOfficeIcon } from './Icons';

interface MandateStartScreenProps {
    playerName: string;
    onContinue: () => void;
}

const MandateStartScreen: React.FC<MandateStartScreenProps> = ({ playerName, onContinue }) => {
    
    const mandateTexts = useMemo(() => [
        `En aquest dia solemne, el/la Molt Honorable Conseller/a ${playerName} assumeix formalment la responsabilitat de la Conselleria de Territori, Habitatge i Transició Ecològica. El seu mandat de quatre anys serà decisiu per afrontar el repte energètic de Catalunya. Haurà de gestionar amb saviesa el pressupost públic, mantenir la confiança de la ciutadania i reduir les emissions de CO₂, garantint alhora un subministrament elèctric estable. Que les seves decisions portin prosperitat i sostenibilitat al país.`,
        `Avui, ${playerName} jura el seu càrrec com a nou/va Conseller/a d'Energia. S'enfronta a un mandat de quatre anys ple de reptes: des de la construcció de noves infraestructures fins a la gestió de crisis inesperades. El seu èxit es mesurarà per la seva habilitat per equilibrar les finances, l'opinió pública i l'impacte mediambiental. Comença una nova etapa per al model energètic català.`,
        `Queda oficialment inaugurat el mandat del Conseller/a ${playerName}. Durant els pròxims quatre anys, la seva gestió serà clau per a la transició energètica. Cada decisió comptarà per assegurar l'estabilitat de la xarxa, controlar la despesa i complir amb els objectius climàtics. La ciutadania espera lideratge i resultats.`
    ], [playerName]);

    const selectedText = useMemo(() => mandateTexts[Math.floor(Math.random() * mandateTexts.length)], [mandateTexts]);

    return (
        <div className="min-h-screen text-slate-800 font-sans p-4 bg-slate-100 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-8 my-8 border-2 border-yellow-400/50 transform transition-all">
                <div className="text-center">
                    <BuildingOfficeIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 tracking-wider">ACTA DE PRESA DE POSSESSIÓ</h1>
                    <p className="text-yellow-600 mt-2 text-lg">Inici del Mandat</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg my-8 text-lg leading-relaxed text-center border border-slate-200">
                    <p>{selectedText}</p>
                </div>
                
                <div className="text-center text-sm text-slate-500 mb-8">
                    <p>La teva missió és completar el mandat de 4 anys (16 trimestres) mantenint l'equilibri entre el <strong className="text-slate-800">pressupost</strong>, l'<strong className="text-slate-800">aprovació ciutadana</strong> i les <strong className="text-slate-800">emissions de CO₂</strong>. Per a més informació, consulta la Guia del Joc.</p>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onContinue}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Acceptar el Càrrec i Començar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MandateStartScreen;