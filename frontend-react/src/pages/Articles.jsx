import React, { useState, useEffect } from 'react';
import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import { Search } from 'lucide-react';

const Articles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState(articles);

    useEffect(() => {
        const results = articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(results);
    }, [searchTerm]);

    return (
        <div className="container fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Pregnancy & Wellness Guide</h1>
                <p className="text-lg text-secondary max-w-2xl mx-auto">
                    Explore our comprehensive library of trusted articles, tips, and resources for every stage of your journey.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 4rem auto', position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                }}>
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search for topics (e.g., 'sleep', 'nutrition')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                        fontSize: '1rem',
                        boxShadow: 'var(--shadow-sm)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 animate-fade-in" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))
                ) : (
                    <div className="text-center col-span-full py-12 text-secondary">
                        No articles found matching "{searchTerm}". Try a different keyword.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
