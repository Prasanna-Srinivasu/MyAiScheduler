import { useState } from 'react';
import { Sparkles, MessageSquare, CalendarClock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSchedule } from '../hooks/useSchedule';
import { AiInput } from '../components/ai/AiInput';
import { AiSuggestion } from '../components/ai/AiSuggestion';
import { AiChat } from '../components/ai/AiChat';
import './AiSchedulerPage.css';

export function AiSchedulerPage() {
  const { user } = useAuth();
  const { generateWithAi, generating } = useSchedule();
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'chat'

  const handleGenerate = async (params) => {
    try {
      const result = await generateWithAi(params);
      setGeneratedPlan(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ai-scheduler-page">
      <div className="ai-page-header">
        <div>
          <h2 className="page-heading">AI Adaptive Scheduler</h2>
          <p className="page-subheading">
            Harness intelligent scheduling algorithms tailored to your developer goals, daily energy, and available time.
          </p>
        </div>

        <div className="ai-tab-buttons">
          <button
            className={`ai-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <CalendarClock size={16} />
            Schedule Generator
          </button>
          <button
            className={`ai-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} />
            AI Coach Chat
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="ai-generator-layout">
          <div className="generator-form-col">
            <AiInput
              onGenerate={handleGenerate}
              loading={generating}
              userRole={user?.targetRole}
              userLevel={user?.experienceLevel}
            />
          </div>

          <div className="generator-result-col">
            {generatedPlan ? (
              <AiSuggestion plan={generatedPlan} />
            ) : (
              <div className="ai-placeholder-card">
                <div className="placeholder-sparkle">
                  <Sparkles size={40} />
                </div>
                <h3>Your AI Schedule Will Appear Here</h3>
                <p>
                  Fill in your study duration, energy level, and role parameters on the left, then click
                  <strong> "Generate Optimized Schedule"</strong> to generate your custom task blocks.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="ai-chat-layout">
          <AiChat />
        </div>
      )}
    </div>
  );
}

export default AiSchedulerPage;
