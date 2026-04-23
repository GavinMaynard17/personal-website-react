import React, { useState, useCallback } from 'react';
import Bracket from './Bracket';
import './BracketBuddy.scss';

const BracketBuddy = () => {
  const [numParticipants, setNumParticipants] = useState(4);
  const [bracketType, setBracketType] = useState('single');
  const [advancementMethod, setAdvancementMethod] = useState('choice');
  const [setupMode, setSetupMode] = useState(true);
  const [participants, setParticipants] = useState(
    Array.from({ length: 4 }, (_, i) => ({ id: i, name: '', image: null }))
  );
  const [matchWinners, setMatchWinners] = useState({});
  const [champion, setChampion] = useState(null);
  const [isChampionModalOpen, setIsChampionModalOpen] = useState(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  const totalRounds = Math.ceil(Math.log2(numParticipants));

  const createBlankParticipants = useCallback((count) => (
    Array.from({ length: count }, (_, i) => ({ id: i, name: '', image: null }))
  ), []);

  const rebuildParticipants = useCallback((value) => {
    return Array.from({ length: value }, (_, i) => participants[i] || { id: i, name: '', image: null });
  }, [participants]);

  const closeChampionModal = useCallback(() => {
    setIsChampionModalOpen(false);
  }, []);

  const openChampionModal = useCallback(() => {
    if (champion) {
      setIsChampionModalOpen(true);
    }
  }, [champion]);

  const handleNewBracket = useCallback(() => {
    setParticipants(createBlankParticipants(numParticipants));
    setMatchWinners({});
    setChampion(null);
    setIsChampionModalOpen(false);
    setSetupMode(true);
  }, [createBlankParticipants, numParticipants]);

  const handleNumParticipantsChange = useCallback((value) => {
    if (value >= 4 && value <= 32) {
      setNumParticipants(value);
      setParticipants(rebuildParticipants(value));
      setMatchWinners({});
      setChampion(null);
      setIsChampionModalOpen(false);
    }
  }, [rebuildParticipants]);

  const handleAdvancementMethodChange = useCallback((method) => {
    setAdvancementMethod(method);
    setChampion(null);
    setIsChampionModalOpen(false);
  }, []);

  const handleBracketTypeChange = useCallback((type) => {
    setBracketType(type);
    setMatchWinners({});
    setChampion(null);
    setIsChampionModalOpen(false);
  }, []);

  const handleSetupModeChange = useCallback(() => {
    setSetupMode((prev) => {
      if (!prev) {
        // switching to setup mode: clear existing results (prevents stale winners)
        setMatchWinners({});
        setChampion(null);
        setIsChampionModalOpen(false);
      }
      return !prev;
    });
  }, []);

  const updateParticipant = useCallback((index, field, value) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
    setMatchWinners({});
    setChampion(null);
    setIsChampionModalOpen(false);
  }, []);

  const handleWinnerChange = useCallback((round, matchIndex, winnerParticipant, matchId, isFinalMatch = false) => {
    setMatchWinners((prev) => {
      const next = { ...prev };
      const key = matchId || `${round}-${matchIndex}`;

      Object.keys(next).forEach((existingKey) => {
        if (bracketType === 'double') {
          const [, stage] = existingKey.match(/^D-(\d+)-/) || [];
          if (stage !== undefined && Number(stage) > round) delete next[existingKey];
          return;
        }

        const [r] = existingKey.split('-').map(Number);
        if (r > round) delete next[existingKey];
      });

      if (!winnerParticipant) {
        delete next[key];
      } else {
        next[key] = winnerParticipant;
      }
      return next;
    });

    if ((bracketType === 'double' && isFinalMatch && winnerParticipant) || (bracketType === 'single' && round === totalRounds - 1 && winnerParticipant)) {
      setChampion(winnerParticipant);
      setIsChampionModalOpen(true);
    } else if ((bracketType === 'double' && isFinalMatch) || (bracketType === 'single' && round === totalRounds - 1)) {
      setChampion(null);
      setIsChampionModalOpen(false);
    } else if (bracketType === 'double') {
      setChampion(null);
      setIsChampionModalOpen(false);
    }
  }, [bracketType, totalRounds]);

  return (
    <div className="bracket-buddy">
      <div className="bracket-workspace">
        <aside className={`controls ${isControlsCollapsed ? 'collapsed' : ''}`}>
          <div className="controls-header">
            <span>Setup</span>
            <button
              type="button"
              className="controls-toggle"
              aria-expanded={!isControlsCollapsed}
              onClick={() => setIsControlsCollapsed((prev) => !prev)}
            >
              {isControlsCollapsed ? 'Show' : 'Hide'}
            </button>
          </div>

          {!isControlsCollapsed && (
            <div className="controls-body">
              <div className="control-group">
                <label>Number of Participants:</label>
                <div className="radio-group">
                  {[4, 8, 16, 32].map((num) => (
                    <label key={num}>
                      <input
                        type="radio"
                        name="numParticipants"
                        value={num}
                        checked={numParticipants === num}
                        onChange={() => handleNumParticipantsChange(num)}
                      />
                      {num}
                    </label>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label>Bracket Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="bracketType"
                      value="single"
                      checked={bracketType === 'single'}
                      onChange={() => handleBracketTypeChange('single')}
                    />
                    Single
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="bracketType"
                      value="double"
                      checked={bracketType === 'double'}
                      onChange={() => handleBracketTypeChange('double')}
                    />
                    Double
                  </label>
                </div>
              </div>

              <div className="control-group">
                <label>Advancement Method:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="advancementMethod"
                      value="choice"
                      checked={advancementMethod === 'choice'}
                      onChange={() => handleAdvancementMethodChange('choice')}
                    />
                    By Choice
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="advancementMethod"
                      value="picture"
                      checked={advancementMethod === 'picture'}
                      onChange={() => handleAdvancementMethodChange('picture')}
                    />
                    By Picture
                  </label>
                </div>
              </div>

              <div className="control-group">
                <label>
                  <input
                    type="checkbox"
                    checked={setupMode}
                    onChange={handleSetupModeChange}
                  />
                  Setup Mode
                </label>
              </div>

              <div className="control-actions">
                <button type="button" className="config-btn primary" onClick={handleNewBracket}>
                  New Bracket
                </button>
                {champion && (
                  <button type="button" className="config-btn secondary" onClick={openChampionModal}>
                    View Winner
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>

        <div className="bracket-container">
          <Bracket
            participants={participants}
            setupMode={setupMode}
            bracketType={bracketType}
            advanceType={advancementMethod}
            matchWinners={matchWinners}
            onParticipantUpdate={updateParticipant}
            onWinnerChange={handleWinnerChange}
          />
        </div>
      </div>

      {champion && isChampionModalOpen && (
        <div className="champion-modal-overlay" onClick={closeChampionModal}>
          <div className="champion-modal" onClick={(e) => e.stopPropagation()}>
            <p className="champion-kicker">Champion</p>
            <h2>{champion.name || 'Winner selected'}</h2>
            {advancementMethod === 'picture' && champion.image && (
              <img
                className="champion-image"
                src={champion.image}
                alt={champion.name || 'Champion'}
              />
            )}
            <div className="champion-actions">
              <button type="button" className="champion-btn primary" onClick={handleNewBracket}>
                New Bracket
              </button>
              <button type="button" className="champion-btn secondary" onClick={closeChampionModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="version-number">Bracket Buddy v1.0</p>
    </div>
  );
};

export default BracketBuddy;
