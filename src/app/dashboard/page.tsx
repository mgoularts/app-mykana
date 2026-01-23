import { useState } from 'react';
import { Send } from 'lucide-react';

export default function DashboardPage() {
  const [suggestion, setSuggestion] = useState('');

  const handleSendSuggestion = () => {
    if (suggestion.trim()) {
      alert('Sugestão enviada com sucesso!');
      setSuggestion('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="bg-gradient-to-br from-gray-50 via-green-50 to-teal-50 rounded-2xl border-2 border-teal-200 p-6">
        <h3 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Envie sua Sugestão
        </h3>
        <p className="text-sm text-teal-700 mb-4">
          Compartilhe suas ideias, feedbacks ou sugestões para melhorar o aplicativo
        </p>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Digite sua sugestão aqui..."
          className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
          rows={4}
        />
        <button
          onClick={handleSendSuggestion}
          disabled={!suggestion.trim()}
          className={`mt-3 w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            suggestion.trim()
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          Enviar Sugestão
        </button>
      </div>
    </div>
  );
}