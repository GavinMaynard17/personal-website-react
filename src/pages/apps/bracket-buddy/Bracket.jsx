import React, { useMemo } from 'react';
import './Bracket.scss';
import Matchup from './Matchup';

const Bracket = React.memo(({ participants, setupMode, advanceType, matchWinners, onParticipantUpdate, onWinnerChange }) => {
  const totalRounds = useMemo(() => Math.ceil(Math.log2(participants.length)), [participants.length]);

  const rounds = useMemo(() => {
    const allRounds = [];

    const firstRoundMatches = [];
    for (let i = 0; i < participants.length; i += 2) {
      firstRoundMatches.push({
        id: `0-${i / 2}`,
        p1: participants[i] || { id: -1, name: '', image: null },
        p2: participants[i + 1] || { id: -1, name: '', image: null },
      });
    }
    allRounds.push(firstRoundMatches);

    for (let round = 1; round < totalRounds; round++) {
      const prev = allRounds[round - 1];
      const nextRoundMatches = [];
      for (let i = 0; i < prev.length; i += 2) {
        const leftWinner = matchWinners[`${round - 1}-${i}`] || { id: -1, name: '', image: null };
        const rightWinner = matchWinners[`${round - 1}-${i + 1}`] || { id: -1, name: '', image: null };
        nextRoundMatches.push({
          id: `${round}-${i / 2}`,
          p1: leftWinner,
          p2: rightWinner,
        });
      }
      allRounds.push(nextRoundMatches);
    }

    return allRounds;
  }, [participants, totalRounds, matchWinners]);

  const matchItemHeight = 96; // uniform card height for line math
  const matchGap = 24;
  const roundHeaderHeight = 56;
  const roundPadding = 32; // top+bottom padding inside each round

  const maxMatches = rounds[0]?.length || 1;
  const matchStackHeight = maxMatches * matchItemHeight + (maxMatches - 1) * matchGap;
  const roundMinHeight = roundHeaderHeight + roundPadding + matchStackHeight;

  const itemStride = matchItemHeight + matchGap;

  const computeMatchTop = (roundIndex, matchIndex) => {
    if (roundIndex === 0) return matchIndex * itemStride;
    const step = itemStride * Math.pow(2, roundIndex);
    const firstMatchTop = itemStride * ((Math.pow(2, roundIndex) - 1) / 2);
    return firstMatchTop + matchIndex * step;
  };

  return (
    <div className="bracket">
      {rounds.map((roundMatches, roundIndex) => (
        <div key={roundIndex} className="round" style={{ minHeight: `${roundMinHeight}px` }}>
          <h3>Round {roundIndex + 1}</h3>
          <div className="round-matches" style={{ height: `${matchStackHeight}px` }}>
            {roundMatches.map((match, matchIndex) => (
              <div
                key={match.id}
                className="match"
                style={{ position: 'absolute', width: '100%', top: `${computeMatchTop(roundIndex, matchIndex)}px` }}
              >
                <Matchup
                  match={match}
                  roundIndex={roundIndex}
                  winner={matchWinners[match.id] || null}
                  isSetup={setupMode}
                  advanceType={advanceType}
                  onWinnerChange={onWinnerChange}
                  onParticipantUpdate={onParticipantUpdate}
                  hasConnector={roundIndex < totalRounds - 1}
                  incomingVerticalHeight={
                    roundIndex === 0 
                      ? 0 
                      : itemStride * Math.pow(2, roundIndex - 1)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default Bracket;
