'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import { useState } from 'react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    const [activeTab, setActiveTab] = useState<'tops' | 'bottoms'>('tops');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                                        <Ruler size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                                        Guía de Tallas
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-full transition-colors text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-neutral-100 dark:border-white/5">
                                <button
                                    onClick={() => setActiveTab('tops')}
                                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'tops'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                        }`}
                                >
                                    Partes Superiores
                                    {activeTab === 'tops' && (
                                        <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('bottoms')}
                                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'bottoms'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                        }`}
                                >
                                    Partes Inferiores
                                    {activeTab === 'bottoms' && (
                                        <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto">
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-xl text-sm mb-6 flex gap-3">
                                    <Ruler className="flex-shrink-0 w-5 h-5" />
                                    <p>Las medidas están en centímetros (cm). Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad.</p>
                                </div>

                                {activeTab === 'tops' ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 uppercase font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Talla</th>
                                                    <th className="px-4 py-3">Pecho</th>
                                                    <th className="px-4 py-3">Hombros</th>
                                                    <th className="px-4 py-3">Largo</th>
                                                    <th className="px-4 py-3 rounded-r-lg">Manga</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">S</td>
                                                    <td className="px-4 py-3">92 - 96</td>
                                                    <td className="px-4 py-3">42 - 44</td>
                                                    <td className="px-4 py-3">68</td>
                                                    <td className="px-4 py-3">20</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">M</td>
                                                    <td className="px-4 py-3">96 - 104</td>
                                                    <td className="px-4 py-3">44 - 46</td>
                                                    <td className="px-4 py-3">70</td>
                                                    <td className="px-4 py-3">21</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">L</td>
                                                    <td className="px-4 py-3">104 - 112</td>
                                                    <td className="px-4 py-3">46 - 48</td>
                                                    <td className="px-4 py-3">72</td>
                                                    <td className="px-4 py-3">22</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">XL</td>
                                                    <td className="px-4 py-3">112 - 120</td>
                                                    <td className="px-4 py-3">48 - 50</td>
                                                    <td className="px-4 py-3">74</td>
                                                    <td className="px-4 py-3">23</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 uppercase font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Talla</th>
                                                    <th className="px-4 py-3">Cintura</th>
                                                    <th className="px-4 py-3">Cadera</th>
                                                    <th className="px-4 py-3 rounded-r-lg">Largo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">S</td>
                                                    <td className="px-4 py-3">76 - 80</td>
                                                    <td className="px-4 py-3">92 - 96</td>
                                                    <td className="px-4 py-3">100</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">M</td>
                                                    <td className="px-4 py-3">80 - 84</td>
                                                    <td className="px-4 py-3">96 - 100</td>
                                                    <td className="px-4 py-3">102</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">L</td>
                                                    <td className="px-4 py-3">84 - 88</td>
                                                    <td className="px-4 py-3">100 - 104</td>
                                                    <td className="px-4 py-3">104</td>
                                                </tr>
                                                <tr className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold">XL</td>
                                                    <td className="px-4 py-3">88 - 92</td>
                                                    <td className="px-4 py-3">104 - 108</td>
                                                    <td className="px-4 py-3">106</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
