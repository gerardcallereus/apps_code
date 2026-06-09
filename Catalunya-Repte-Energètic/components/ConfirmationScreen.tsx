import React from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './Icons';

interface ConfirmationScreenProps {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    children: React.ReactNode;
    pros?: string[];
    cons?: string[];
    importantInfo?: string[];
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ title, onConfirm, onCancel, confirmText, children, pros, cons, importantInfo }) => {
    return (
        <div className="min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl border border-yellow-400 my-8 mx-auto flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4">{title}</h2>
                    <div className="text-slate-700 bg-slate-100 rounded-lg p-4">
                        {children}
                    </div>
                </div>
                
                {importantInfo && importantInfo.length > 0 && (
                     <div className="px-6 pb-6">
                        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
                             <h4 className="flex items-center text-md font-semibold text-blue-700 mb-2">
                                <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                Informació Important
                            </h4>
                             <ul className="space-y-1.5 pl-2">
                                {importantInfo.map((info, i) => (
                                    <li key={`info-${i}`} className="text-sm text-slate-600 flex items-start">
                                        <span className="text-blue-500 mr-2 mt-1">&#8227;</span>
                                        <span>{info}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {(pros || cons) && (
                    <div className="overflow-y-auto px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Pros Column */}
                            <div>
                                <h4 className="flex items-center text-lg font-semibold text-green-600 mb-2">
                                    <CheckCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" />
                                    Pros
                                </h4>
                                <ul className="space-y-1.5 pl-2">
                                    {pros?.map((pro, i) => (
                                        <li key={`pro-${i}`} className="text-sm text-slate-700 flex items-start">
                                            <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cons Column */}
                            <div>
                                <h4 className="flex items-center text-lg font-semibold text-red-600 mb-2">
                                    <XCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" />
                                    Contres
                                </h4>
                                <ul className="space-y-1.5 pl-2">
                                    {cons?.map((con, i) => (
                                        <li key={`con-${i}`} className="text-sm text-slate-700 flex items-start">
                                            <span className="text-red-500 mr-2 mt-1">&#10007;</span>
                                            <span>{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 mt-auto bg-slate-50 rounded-b-lg">
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onCancel}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Cancel·lar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationScreen;