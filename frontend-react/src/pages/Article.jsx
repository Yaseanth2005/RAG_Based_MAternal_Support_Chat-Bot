import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X, AlertTriangle, Lightbulb, ExternalLink, BookOpen, Info, ShieldAlert } from 'lucide-react';
import { articles } from '../data/articles';

const Article = () => {
    const { id } = useParams();
    const article = articles.find(a => a.id === id);
    const [scrollProgress, setScrollProgress] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = Math.min(totalScroll / windowHeight, 1);
            setScrollProgress(scroll);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = article ? `${article.title} | MaternalCare` : 'Article Not Found';
    }, [id, article]);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 font-sans">
                <div className="text-center p-10 max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-200 dark:border-gray-800 shadow-2xl">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-200 dark:border-red-500/20">
                        <AlertTriangle size={32} className="text-red-500 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Article Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">The requested guide could not be located.</p>
                    <Link to="/" className="inline-flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all hover:scale-105 shadow-lg text-base font-bold">
                        <ArrowLeft size={20} className="mr-2" />
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const Icon = article.icon;
    const themeColor = article.color || '#10b981';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300 pb-32 transition-colors duration-300">
            {/* Progress Bar */}
            <div
                className="fixed top-0 left-0 h-[4px] z-50 transition-all duration-300 ease-out shadow-sm"
                style={{
                    width: `${scrollProgress * 100}%`,
                    backgroundColor: themeColor
                }}
            />

            <div className="relative z-10">
                {/* Header: Back Button - Standardized Spacing */}
                <div className="pt-16 px-6 md:px-12 pb-16">
                    <Link
                        to="/"
                        className="btn btn-primary py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm font-bold inline-flex items-center"
                    >
                        <ArrowLeft size={18} className="mr-2" strokeWidth={2.5} />
                        Back
                    </Link>
                </div>

                {/* Main Content Container - switched to FLEX COLUMN GAP for guaranteed spacing */}
                <main className="container mx-auto px-6 md:px-12 max-w-6xl flex flex-col gap-32">

                    {/* Hero Section - Standardized Width */}
                    <div className="w-full max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center p-6 mb-10 rounded-[2.5rem] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl animate-fade-in-up">
                            <Icon size={48} style={{ color: themeColor }} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-10 text-gray-900 dark:text-white tracking-tight leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {article.content.overview}
                        </p>
                    </div>

                    {/* Key Takeaways - Standardized Width & Removed bottom margin (gap handled by parent) */}
                    <section className="w-full max-w-5xl mx-auto">
                        <div className="info-capsule p-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors rounded-[2.5rem]">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-500">
                                    <Lightbulb size={28} style={{ color: themeColor }} fill="currentColor" className="opacity-80" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">At a Glance</h2>
                            </div>

                            <ul className="space-y-6">
                                {article.content.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-lg text-gray-700 dark:text-gray-200 font-medium">
                                        <div
                                            className="mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0"
                                            style={{ borderColor: themeColor, color: themeColor, backgroundColor: 'transparent' }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <span className="leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Guidelines - Standardized Width */}
                    <section className="w-full max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
                            {/* Do Box */}
                            <div className="info-capsule-do p-10 bg-white group transition-all duration-300 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-green-200 dark:border-green-800/30">
                                    <div className="p-3 rounded-full bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700">
                                        <Check size={24} strokeWidth={4} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">Recommended</h3>
                                </div>
                                <ul className="space-y-4">
                                    {article.content.dosAndDonts.dos.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-semibold text-lg">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Don't Box */}
                            <div className="info-capsule-dont p-10 bg-white group transition-all duration-300 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-red-200 dark:border-red-800/30">
                                    <div className="p-3 rounded-full bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700">
                                        <X size={24} strokeWidth={4} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">Avoid This</h3>
                                </div>
                                <ul className="space-y-4">
                                    {article.content.dosAndDonts.donts.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-semibold text-lg">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Medical Help - Standardized Width & Styling */}
                    {article.content.warningSigns && (
                        <section className="w-full max-w-5xl mx-auto">
                            {/* Explicit White Background and Border again to ensure visibility */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border-2 border-orange-200 dark:border-orange-900/50 shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500" />

                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                                    <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800">
                                        <ShieldAlert size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">When to Call a Doctor</h2>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Immediate medical attention required if you experience:</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {article.content.warningSigns.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-6 p-4 rounded-[2.5rem] border-2 border-red-100 dark:border-red-800/30 bg-white hover:border-red-400 dark:hover:border-red-500 transition-all group">
                                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-2 border-red-100 dark:border-red-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-600 transition-colors">
                                                <AlertTriangle size={20} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 font-bold text-lg leading-relaxed pt-1">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Expert Tips & Resources - Standardized Width */}
                    <div className="w-full max-w-5xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-16 pb-20">
                        {/* Tips */}
                        <div className="md:col-span-12 lg:col-span-6">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800">
                                    <Info size={28} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Expert Insights</h2>
                            </div>
                            <div className="space-y-8">
                                {article.content.tips.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="info-capsule flex gap-6 group hover:border-purple-400 dark:hover:border-purple-500 cursor-default rounded-[2.5rem] border-2"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-lg border-2 border-purple-100 dark:border-purple-800 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-600 transition-all">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-2 font-bold text-lg">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resources */}
                        <div className="md:col-span-12 lg:col-span-6">
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] p-10 border-2 border-blue-100 dark:border-blue-900/30 h-full">
                                <div className="flex items-center gap-3 mb-8">
                                    <BookOpen size={28} className="text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sources</h2>
                                </div>
                                <div className="space-y-6">
                                    {article.content.references.map((ref, idx) => (
                                        <a
                                            key={idx}
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="info-capsule-button info-capsule-resource group block"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ExternalLink size={18} className="text-blue-500 group-hover:text-blue-600" />
                                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">VISIT</span>
                                            </div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {ref.title}
                                            </h4>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Article;
