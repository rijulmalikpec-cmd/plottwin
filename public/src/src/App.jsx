import React, { useState } from 'react';
import { Film, Search, Sparkles, ArrowRight, Zap, Target, Clock, Heart } from 'lucide-react';

export default function PlotTwin() {
  const [filmInput, setFilmInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeFilm = async () => {
    if (!filmInput.trim()) {
      setError('Please enter a film title');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const prompt = `You are PlotTwin, a semantic narrative-matching system analyzing "${filmInput}". Find 5 films with similar narrative DNA. Return ONLY valid JSON in this exact format:
{
  "base_film": {
    "title": "Film Title",
    "year": 2020,
    "plot_available": true,
    "semantic_profile": {
      "emotional_polarity": 0.5,
      "conflict_complexity": 0.8,
      "narrative_pace": 0.7,
      "resolution_type": "ambiguous"
    }
  },
  "twins": [
    {
      "rank": 1,
      "title": "Film (Year)",
      "similarity_score": 0.92,
      "similarity_reason": "Brief explanation",
      "shared_motifs": ["motif1", "motif2"],
      "wikipedia_url": "https://en.wikipedia.org/wiki/Film"
    }
  ]
}`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            { role: 'system', content: 'You are PlotTwin. Return ONLY valid JSON, no markdown.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const textContent = data.choices[0]?.message?.content || '';
      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setResult(parsed);
    } catch (err) {
      setError(err.message || 'Failed to analyze film. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Powered by Groq AI</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
              PlotTwin
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
            Discover films with <span className="text-purple-400 font-medium">similar narrative DNA</span>
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 p-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Film className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                  <input
                    type="text"
                    value={filmInput}
                    onChange={(e) => setFilmInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && analyzeFilm()}
                    placeholder="Enter any film title..."
                    className="w-full pl-16 pr-6 py-5 bg-transparent text-lg text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={analyzeFilm}
                  disabled={loading}
                  className="px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Discover</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-3 ml-2 text-red-400 text-sm">{error}</div>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-8">
            {result.base_film.plot_available && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                    {result.base_film.title} ({result.base_film.year})
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-slate-400">Emotional Polarity</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {result.base_film.semantic_profile.emotional_polarity > 0.3 ? 'Uplifting' : 
                         result.base_film.semantic_profile.emotional_polarity < -0.3 ? 'Tragic' : 'Ambiguous'}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-slate-400">Conflict Complexity</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {(result.base_film.semantic_profile.conflict_complexity * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-slate-400">Narrative Pace</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {(result.base_film.semantic_profile.narrative_pace * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <p className="text-sm text-slate-400">Resolution Type</p>
                      </div>
                      <p className="text-xl font-bold text-white capitalize">
                        {result.base_film.semantic_profile.resolution_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="bg-red-500/20 rounded-2xl border border-red-500/30 p-8">
                <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
                <p className="text-slate-300">{result.error}</p>
              </div>
            )}

            {result.twins && result.twins.length > 0 && (
              <div>
                <h3 className="text-4xl font-black text-white mb-8">Narrative Twins</h3>
                <div className="grid gap-6">
                  {result.twins.map((twin) => (
                    <div key={twin.rank} className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                      <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl rotate-6"></div>
                              <div className="relative text-4xl font-black text-white">{twin.rank}</div>
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="text-2xl font-bold text-white mb-1">{twin.title}</h4>
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-bold">
                                {(twin.similarity_score * 100).toFixed(0)}% Match
                              </span>
                            </div>
                            <p className="text-slate-300">{twin.similarity_reason}</p>
                            <div className="flex flex-wrap gap-2">
                              {twin.shared_motifs.map((motif, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-xs font-medium">
                                  {motif}
                                </span>
                              ))}
                            </div>
                            
                              href={twin.wikipedia_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
                            >
                              <span>View on Wikipedia</span>
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/50 backdrop-blur-xl rounded-full border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-slate-400">Free semantic analysis · Pre-2025 films</p>
          </div>
        </div>
      </div>
    </div>
  );
}
