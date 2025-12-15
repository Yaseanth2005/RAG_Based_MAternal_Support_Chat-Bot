import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { articles } from '../data/articles';
import { MessageCircle, Shield, Heart } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col gap-20 pb-40">
            {/* Hero Section */}
            <section className="text-center pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
                <div className="container max-w-4xl mx-auto px-6 flex flex-col items-center">

                    {/* Badge */}
                    <div className="hero-badge mb-12">
                        <Heart size={15} fill="currentColor" />
                        <span className="text-xs font-bold tracking-widest uppercase">Compassionate Care for Every Mother</span>
                    </div>

                    {/* Heading */}
                    <h1 className="hero-heading mb-10 text-balance text-slate-900 dark:text-white">
                        Your Personal <span className="text-emerald-600 dark:text-emerald-400">Maternal Health</span>
                        <br />
                        & Wellness Companion
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-16 max-w-3xl mx-auto leading-relaxed font-normal text-balance">
                        Get instant, trusted answers to your pregnancy questions, track your wellness, and find peace of mind with our guided AI support.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-row items-center justify-center gap-6 w-full sm:w-auto">
                        <Link to="/chat" className="btn btn-primary px-10 py-4 text-lg font-semibold shadow-lg transition-all rounded-xl">
                            <MessageCircle size={22} className="mr-3" strokeWidth={2} />
                            Start Chatting
                        </Link>
                        <Link to="/articles" className="btn px-10 py-4 text-lg font-semibold transition-all rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
                            Read Articles
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container px-6">
                <div className="grid gap-12 md:grid-cols-3 items-stretch">
                    <FeatureCard
                        icon={Shield}
                        title="Trusted Information"
                        colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                        description="Reliable, medically-aware guidance grounded in established maternal health practices."
                    />
                    <FeatureCard
                        icon={MessageCircle}
                        title="24/7 AI Support"
                        colorClass="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        description="Always here to listen and answer your questions, day or night, whenever you need support."
                    />
                    <FeatureCard
                        icon={Heart}
                        title="Emotional Wellness"
                        colorClass="text-rose-600 bg-rose-50 dark:bg-rose-900/20"
                        description="Focusing not just on physical health, but mental well-being for a holistic journey."
                    />
                </div>
            </section>

            {/* Articles Section */}
            <section id="articles" className="container px-6">
                <div className="flex items-center justify-between mb-16 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">Latest Insights</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">Expert guides for your journey</p>
                    </div>
                    <Link to="/articles" className="text-emerald-600 font-bold hover:text-emerald-700 text-base flex items-center gap-2 transition-colors px-6 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                        View All <span className="hidden sm:inline">Articles</span> &rarr;
                    </Link>
                </div>

                {/* 3x3 Grid Layout */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(0, 9).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </div>
    );
};

// Internal Feature Card Component for consistency
const FeatureCard = ({ icon: Icon, title, description, colorClass }) => (
    <div className="card card-hover flex flex-col items-center text-center p-10 h-full border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-2 rounded-3xl bg-white dark:bg-slate-900">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClass}`}>
            <Icon size={32} strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed flex-grow">
            {description}
        </p>
    </div>
);

export default Home;
