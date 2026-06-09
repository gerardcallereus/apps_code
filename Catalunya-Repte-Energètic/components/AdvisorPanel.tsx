import React from 'react';
import { GameState } from '../types';
import { CO2_WARNING_THRESHOLD, APPROVAL_LOSS_THRESHOLD } from '../constants';
import { LightbulbIcon } from './Icons';

interface AdvisorPanelProps {
    gameState: GameState;
}

const getAdvice = (gameState: GameState): string[] => {
    const advices: string[] = [];

    // Critical issues (priority 1)
    if (gameState.energyDeficit > 0) {
        advices.push("DÈFICIT CRÍTIC: La teva producció no cobreix la demanda. És urgent construir noves centrals per evitar talls de llum i costos d'importació elevats.");
    }
    if (gameState.budget < 2500) {
        advices.push("PRESSUPOST BAIX: Estàs a prop de la bancarrota. Atura les inversions no essencials i busca fonts d'ingressos o redueix despeses de manteniment.");
    }
    // FIX: Replaced deprecated publicApproval with overallApproval
    if (gameState.overallApproval < APPROVAL_LOSS_THRESHOLD + 10) {
        advices.push("APROVACIÓ BAIXA: La confiança ciutadana està sota mínims. Impulsa mesures populars o construeix centrals ben vistes (solar, eòlica) per evitar una crisi social.");
    }

    if (advices.length >= 2) return advices.slice(0, 2);

    // Important issues (priority 2)
    if (gameState.co2Emissions > CO2_WARNING_THRESHOLD) {
        advices.push("EMISSIONS ALTES: Els nivells de CO₂ són preocupants. Considera substituir les centrals de combustibles fòssils per energies renovables per evitar sancions de la UE.");
    }

    if (advices.length >= 2) return advices.slice(0, 2);
    
    // Strategic advice (priority 3)
    const productionMargin = gameState.totalProduction - gameState.totalDemand;
    if (productionMargin < gameState.totalDemand * 0.1) {
        advices.push("MARGE ESTRET: El teu marge entre producció i demanda és ajustat. Planifica noves construccions per afrontar futurs pics de consum o avaries inesperades.");
    }

    if (gameState.budget > 15000) {
        advices.push("PRESSUPOST SÒLID: Tens un bon coixí financer. És un moment ideal per a grans inversions estratègiques a llarg termini, com centrals hidroelèctriques o nuclears.");
    }
    
    const fossilPlants = gameState.powerPlants.filter(p => p.type === 'Combustibles Fòssils' && p.isActive);
    const fossilProduction = fossilPlants.reduce((acc, p) => acc + (p.capacity * 0.55), 0);
    if (gameState.totalProduction > 0 && (fossilProduction / gameState.totalProduction > 0.3)) {
        advices.push("DEPENDÈNCIA FÒSSIL: Depens molt del gas. Diversificar amb més renovables et donarà estabilitat davant les pujades de preu del mercat i reduirà les teves emissions.");
    }

    if (advices.length === 0) {
        advices.push("SITUACIÓ ESTABLE: Tot sembla sota control. Continua monitorant els indicadors i planificant a llarg termini per mantenir l'estabilitat energètica i econòmica.");
        advices.push("OPORTUNITAT DE MILLORA: Revisa les teves centrals menys eficients. Potser és un bon moment per modernitzar la teva xarxa o invertir en tecnologia per millorar la productivitat.");
    }

    return advices.slice(0, 2);
}

const AdvisorPanel: React.FC<AdvisorPanelProps> = ({ gameState }) => {
    const adviceList = getAdvice(gameState);

    return (
        <div className="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
            <h3 className="text-lg font-bold text-teal-600 mb-3 text-center">Consell d'Assessors</h3>
            <div className="flex flex-col md:flex-row gap-4">
                {adviceList.map((advice, index) => (
                    <div key={index} className="flex-1 bg-white p-3 rounded-lg flex items-start gap-3 border border-slate-200">
                        <LightbulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <p className="text-sm text-slate-700">{advice}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdvisorPanel;