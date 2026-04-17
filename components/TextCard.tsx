import React from "react";
import Link from "next/link";

type Props = {
  id: number | string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  createdByName?: string | null;
  quizCount?: number;
};

export default function TextCard({ id, title, category, excerpt, createdByName, quizCount }: Props) {
  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group">
      {/* Card Header with gradient accent */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
      
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              📁 {category}
            </span>
          )}
          {quizCount !== undefined && quizCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              🏆 {quizCount} Kuis
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          <Link href={`/texts/${id}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        {/* Author & Excerpt */}
        <div className="space-y-2">
          {createdByName && (
            <div className="flex items-center text-sm text-slate-600">
              <span className="mr-2">✍️</span>
              <span>Oleh: <span className="font-medium text-slate-700">{createdByName}</span></span>
            </div>
          )}
          {excerpt && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>

        {/* Gamification: Progress or XP indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Materi Teruji
            </span>
          </div>
          <Link 
            href={`/texts/${id}`}
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Baca Sekarang
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
