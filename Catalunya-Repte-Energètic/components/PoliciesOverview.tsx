import React from 'react';
import { GameState, Policy, PolicyId, ActivePolicy, DifficultyLevel } from '../types';
import { ALL_POLICIES } from '../constants';
import { ScaleIcon, CheckCircleIcon, XCircleIcon, LightbulbIcon } from './Icons';

interface PoliciesOverviewProps {
    gameState: GameState;
    onEnactPolicy: (policyId: PolicyId) => void;
    turn: number;
    onCancelPolicy: (policyId: PolicyId) => void;
    onRethinkPolicies: () => void;
}

const PolicyCard: React.FC<{
    policy: Policy;
    activePolicy: ActivePolicy | undefined;
    onEnact: () => void;
    onCancel: () => void;
    budget: number;
    overallApproval: number;
    turn: number;
    isPolicyCurrentlyEnacting: boolean;
}> = ({ policy, activePolicy, onEnact, onCancel, budget, overallApproval, turn, isPolicyCurrentlyEnacting }) => {
    const status = activePolicy?.status || 'available';
    const turnsRemaining = activePolicy ? activePolicy.turnWillResolve - turn : 0;
    
    const successChance = Math.round(Math.min(95, Math.max(10, policy.baseSuccessChance + (overallApproval - 55) * 0.5)));

    const isEnactable = (status === 'available' || status === 'rejected') && budget >= policy.cost;
    const isCancellable = status === 'enacting' && activePolicy?.turnEnacted === turn;
    
    let buttonText = "Proposar Llei";
    let buttonClass = 'bg-indigo-600 hover:bg-indigo-700';
    let isDisabled = false;

    if (status === 'enacting') {
        buttonText = `En tràmits... (${turnsRemaining} trim.)`;
        buttonClass = 'bg-yellow-500 cursor-not-allowed';
        isDisabled = true;
    } else if (status === 'active') {
        buttonText = 'Aprovada i en Vigor';
        buttonClass = 'bg-green-600 cursor-not-allowed';
        isDisabled = true;
    } else if (status === 'rejected') {
        buttonText = 'Rebutjada (Tornar a intentar)';
        buttonClass = 'bg-rose-600 hover:bg-rose-500';
    }

    if (status === 'available' || status === 'rejected') {
        if (!isEnactable) { // Not enough budget
            isDisabled = true;
            buttonClass = 'bg-slate-400 cursor-not-allowed';
        } else if (isPolicyCurrentlyEnacting) {
            isDisabled = true;
            buttonClass = 'bg-slate-400 cursor-not-allowed';
            buttonText = "Llei en tràmit parlamentari";
        }
    }
    
    return (
        <div className="bg-white p-4 rounded-lg flex flex-col h-full border border-slate-200 transition-all duration-300 hover:border-teal-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-2">
                <ScaleIcon className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0" />
                <h3 className="text-lg font-bold text-slate-800">{policy.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-3 flex-grow">{policy.description}</p>
            
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                    <h4 className="font-semibold text-green-600 mb-1 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/>Pros</h4>
                    <ul className="list-disc pl-4 text-slate-600">
                        {policy.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-red-600 mb-1 flex items-center"><XCircleIcon className="w-4 h-4 mr-1"/>Contres</h4>
                    <ul className="list-disc pl-4 text-slate-600">
                        {policy.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                </div>
            </div>

            <div className="text-xs space-y-1 py-2 border-t border-b border-slate-200 mb-3 text-slate-600">
                <div className="flex justify-between"><span>Cost d'Inversió:</span> <span className="font-mono text-slate-800">{policy.cost > 0 ? `${policy.cost.toLocaleString()} M€` : 'Cap'}</span></div>
                <div className="flex justify-between"><span>Temps de Debat:</span> <span className="font-mono text-slate-800">{policy.implementationTime} trimestres</span></div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-600">Èxit Parlamentari:</span>
                    <span className="text-lg font-bold text-yellow-500">{successChance}%</span>
                </div>
                 {isCancellable ? (
                    <button
                        onClick={onCancel}
                        className="w-full font-semibold py-2 px-4 rounded-lg transition bg-red-600 hover:bg-red-700 text-white shadow-md transform hover:scale-105"
                    >
                        Cancel·lar Proposta
                    </button>
                ) : (
                    <button
                        onClick={onEnact}
                        disabled={isDisabled}
                        className={`w-full font-semibold py-2 px-4 rounded-lg transition text-white shadow-md transform hover:scale-105 disabled:transform-none disabled:shadow-none ${buttonClass}`}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};


const PoliciesOverview: React.FC<PoliciesOverviewProps> = ({ gameState, onEnactPolicy, turn, onCancelPolicy, onRethinkPolicies }) => {
    
    const policiesToDisplay = gameState.displayedPolicyIds.map(id =>
        ALL_POLICIES.find(p => p.id === id)
    ).filter((p): p is Policy => p !== undefined);

    const isPolicyCurrentlyEnacting = gameState.policies.some(p => p.status === 'enacting');

    const rethinkCost = gameState.difficulty === DifficultyLevel.Hard ? 300 : 200;
    const canAffordRethink = gameState.budget >= rethinkCost;

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                 <h2 className="text-xl font-bold text-teal-600">Polítiques Públiques</h2>
                 <p className="text-sm text-slate-500 max-w-3xl mx-auto">Impulsa lleis per obtenir beneficis permanents. Cada proposta requereix temps i suport parlamentari per ser aprovada.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-3/4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                        <LightbulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        <h3 className="text-teal-600 text-lg font-bold">Com Funciona?</h3>
                    </div>
                    <p className="text-xs text-slate-600 mb-4">
                        Les Polítiques Públiques són lleis que pots impulsar per obtenir beneficis permanents o desbloquejar noves tecnologies. Són inversions a llarg termini que defineixen el teu llegat.
                    </p>
                    <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 bg-slate-200 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center">1</div>
                            <div>
                                <strong className="text-slate-800 font-semibold">Proposar la Llei</strong>
                                <p className="text-slate-500">Tria una política i fes clic per proposar-la. Això té un cost i inicia el debat. <strong className="text-yellow-600">Només una llei en tràmit alhora.</strong></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 bg-slate-200 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center">2</div>
                            <div>
                                <strong className="text-slate-800 font-semibold">Debat Parlamentari</strong>
                                <p className="text-slate-500">La llei estarà "en tràmits" durant uns trimestres. Hauràs d'esperar que es resolgui.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 bg-slate-200 text-teal-700 font-bold rounded-full w-6 h-6 flex items-center justify-center">3</div>
                            <div>
                                <strong className="text-slate-800 font-semibold">Èxit o Fracàs</strong>
                                <p className="text-slate-500">L'èxit depèn de la teva <strong className="text-slate-800">Aprovació General</strong>. Si es rebutja, podràs tornar-ho a intentar més tard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {gameState.difficulty !== DifficultyLevel.Easy && (
                    <div className="md:w-1/4 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-center items-center text-center">
                        <h3 className="text-base font-bold text-teal-600 mb-2">Reflexió Estratègica</h3>
                        <p className="text-xs text-slate-500 mb-4">No et convencen les opcions actuals? Inverteix en assessors per explorar noves línies polítiques.</p>
                        <button
                            onClick={onRethinkPolicies}
                            disabled={!canAffordRethink}
                            className={`w-full font-semibold py-2 px-4 rounded-lg text-white transition duration-300 shadow-md transform hover:scale-105 disabled:transform-none disabled:shadow-none ${
                                canAffordRethink
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Reflexionar ({rethinkCost.toLocaleString()} M€)
                        </button>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policiesToDisplay.map(policy => (
                     <PolicyCard
                        key={policy.id}
                        policy={policy}
                        activePolicy={gameState.policies.find(p => p.policyId === policy.id)}
                        onEnact={() => onEnactPolicy(policy.id)}
                        onCancel={() => onCancelPolicy(policy.id)}
                        budget={gameState.budget}
                        overallApproval={gameState.overallApproval}
                        turn={turn}
                        isPolicyCurrentlyEnacting={isPolicyCurrentlyEnacting}
                    />
                ))}
            </div>
        </div>
    );
};

export default PoliciesOverview;