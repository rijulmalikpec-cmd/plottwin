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

    const prompt = `You are PlotTwin, a semantic narrative-matching system.

TASK: Analyze the film "${filmInput}" and find 5 films with the most similar narrative/emotional structure.

PROCESS:
1. Retrieve plot summary from your training data (Wikipedia-style knowledge).
2. Decompose into semantic dimensions:
   - Emotional polarity: tragic/uplifting/ambiguous (-1 to +1 scale)
   - Conflict complexity: single antagonist vs layered/internal (0-1 scale)  
   - Narrative pace: slow-burn vs rapid escalation (0-1 scale)
   - Resolution type: tragic/redemptive/cyclical/ambiguous

3. Compare against your film knowledge base using:
   - Thematic motifs (betrayal, identity crisis, time manipulation, heist structure, etc.)
   - Protagonist arc similarity (transformation type, moral journey)
   - Climax structure (twist reveal, action crescendo, quiet devastation, etc.)
   - Tonal consistency (noir, surreal, grounded, mythic)

4. Rank top 5 matches by narrative DNA, NOT genre overlap.

VERIFICATION RULES:
- Only include films you have confident plot knowledge of (pre-2025)
- Cross-check that similarity reasoning matches actual plot beats
- Exclude films if plot data insufficient
- Avoid surface-level matches (same director/genre without narrative parallel)

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "base_film": {
    "title": "Exact film title",
    "year": release_year,
    "plot_available": true/false,
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
      "title": "Film Title (Year)",
      "similarity_score": 0.92,
      "similarity_reason": "Brief narrative structural explanation",
      "shared_motifs": ["motif1", "motif2"],
      "wikipedia_url": "https://en.wikipedia.org/wiki/Film_Title"
    }
  ]
}

If film not found or insufficient data, return:
{
  "base_film": {"title": "${filmInput}", "plot_available": false},
  "error": "Explanation of why analysis failed"
}

Respond ONLY with valid JSON. No preamble, no markdown fences.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      
      const textContent = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');

      const cleanJson = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setResult(parsed);
    } catch (err) {
      setError(err.message || 'Failed to analyze film. Check title and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-200">Powered by Claude Semantic Analysis</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 drop-shadow-2xl">
              PlotTwin
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
            Discover films with <span className="text-purple-400 font-medium">similar narrative DNA</span> through advanced semantic analysis
          </p>
        </div>

        {/* Search Input */}
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
                  className="px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Discover Twins</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-3 ml-2 text-red-400 text-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Base Film */}
            {result.base_film.plot_available && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-10">
                  <div className="mb-8">
                    <div className="inline-block px-4 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                      <span className="text-sm font-medium text-purple-300">Base Film Analysis</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                      {result.base_film.title}
                    </h2>
                    <p className="text-2xl text-slate-400 font-light">
                      {result.base_film.year}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-green-500 rounded-xl flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Emotional Polarity</p>
                          <p className="text-xl font-bold text-white capitalize">
                            {result.base_film.semantic_profile.emotional_polarity > 0.3 
                              ? 'Uplifting' 
                              : result.base_film.semantic_profile.emotional_polarity < -0.3 
                              ? 'Tragic' 
                              : 'Ambiguous'}
                          </p>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-1000"
                          style={{ width: `${((result.base_film.semantic_profile.emotional_polarity + 1) / 2) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Conflict Complexity</p>
                          <p className="text-xl font-bold text-white">
                            {(result.base_film.semantic_profile.conflict_complexity * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.base_film.semantic_profile.conflict_complexity * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Narrative Pace</p>
                          <p className="text-xl font-bold text-white">
                            {(result.base_film.semantic_profile.narrative_pace * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.base_film.semantic_profile.narrative_pace * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 hover:border-orange-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Resolution Type</p>
                          <p className="text-xl font-bold text-white capitalize">
                            {result.base_film.semantic_profile.resolution_type}
                          </p>
                        </div>
                      </div>
                      <div className="h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-red-500/30 p-8">
                  <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
                  <p className="text-slate-300">{result.error}</p>
                </div>
              </div>
            )}

            {result.twins && result.twins.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-4xl font-black text-white">Narrative Twins</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>

                <div className="grid gap-6">
                  {result.twins.map((twin, index) => (
                    <div 
                      key={twin.rank}
                      className="relative group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                      <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 p-6">
                          <div className="flex-shrink-0">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                              <div className="relative text-4xl font-black text-white">
                                {twin.rank}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                {twin.title}
                              </h4>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-bold border border-purple-500/30">
                                  {(twin.similarity_score * 100).toFixed(0)}% Match
                                </span>
                              </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed">
                              {twin.similarity_reason}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {twin.shared_motifs.map((motif, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-lg text-xs font-medium border border-white/5 hover:border-purple-500/30 transition-colors"
                                >
                                  {motif}
                                </span>
                              ))}
                            </div>

                            
                              href={twin.wikipedia_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium group/link transition-colors"
                            >
                              <span>View on Wikipedia</span>
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
            <p className="text-sm text-slate-400">
              Semantic analysis based on narrative structure · Films from pre-2025 knowledge base
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

4. Click **Commit new file**

---

Your GitHub repo is now ready! It should look like this:
```
plottwin/
├── README.md
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    └── App.jsx
