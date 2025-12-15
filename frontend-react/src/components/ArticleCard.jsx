import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ArticleCard = ({ article }) => {
    const Icon = article.icon;

    return (
        <Link
            to={`/article/${article.id}`}
            className="card card-hover flex flex-col h-full border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
            style={{
                borderTop: `4px solid ${article.color || 'var(--primary-500)'}`
            }}
        >
            <div className="flex-grow">
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: article.color,
                    color: article.textColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <Icon size={24} strokeWidth={2} />
                </div>

                <h3 className="text-lg font-bold mb-2 text-primary line-clamp-2 leading-tight">
                    {article.title}
                </h3>
                <p className="text-sm text-secondary mb-6 line-clamp-3 leading-relaxed">
                    {article.description}
                </p>
            </div>

            <div className="flex items-center text-primary font-bold text-sm mt-auto group pt-4 border-t border-slate-50 dark:border-slate-800/50">
                Read guide
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
};

export default ArticleCard;
