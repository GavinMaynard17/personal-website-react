import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './Bracket.scss';
import Matchup from './Matchup';

const EMPTY_PARTICIPANT = { id: -1, name: '', image: null };

const SingleEliminationBracket = ({ participants, setupMode, advanceType, matchWinners, onParticipantUpdate, onWinnerChange }) => {
  const totalRounds = useMemo(() => Math.ceil(Math.log2(participants.length)), [participants.length]);

  const rounds = useMemo(() => {
    const allRounds = [];

    const firstRoundMatches = [];
    for (let i = 0; i < participants.length; i += 2) {
      firstRoundMatches.push({
        id: `0-${i / 2}`,
        p1: participants[i] || EMPTY_PARTICIPANT,
        p2: participants[i + 1] || EMPTY_PARTICIPANT,
      });
    }
    allRounds.push(firstRoundMatches);

    for (let round = 1; round < totalRounds; round++) {
      const prev = allRounds[round - 1];
      const nextRoundMatches = [];
      for (let i = 0; i < prev.length; i += 2) {
        const leftWinner = matchWinners[`${round - 1}-${i}`] || EMPTY_PARTICIPANT;
        const rightWinner = matchWinners[`${round - 1}-${i + 1}`] || EMPTY_PARTICIPANT;
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
};

const isValidParticipant = (participant) => participant && participant.id >= 0;

const getMatchLoser = (match, winner) => {
  if (!winner || !isValidParticipant(match.p1) || !isValidParticipant(match.p2)) return EMPTY_PARTICIPANT;
  return winner.id === match.p1.id ? match.p2 : match.p1;
};

const pairParticipants = (items, createMatch) => {
  const matches = [];
  for (let i = 0; i < items.length; i += 2) {
    matches.push(createMatch(items[i] || EMPTY_PARTICIPANT, items[i + 1] || EMPTY_PARTICIPANT, i / 2));
  }
  return matches;
};

const getRoundWinners = (round, matchWinners) => (
  round.map((match) => matchWinners[match.id] || EMPTY_PARTICIPANT)
);

const buildDoubleEliminationBracket = (participants, matchWinners) => {
  const totalRounds = Math.ceil(Math.log2(participants.length));
  const winnersRounds = [];

  winnersRounds.push(pairParticipants(participants, (p1, p2, index) => ({
    id: `D-0-W-${index}`,
    stageIndex: 0,
    connectorType: 'none',
    p1,
    p2,
  })));

  for (let roundIndex = 1; roundIndex < totalRounds; roundIndex += 1) {
    const previousWinners = getRoundWinners(winnersRounds[roundIndex - 1], matchWinners);
    winnersRounds.push(pairParticipants(previousWinners, (p1, p2, index) => ({
      id: `D-${roundIndex}-W-${index}`,
      stageIndex: roundIndex,
      connectorType: 'merge',
      p1,
      p2,
    })));
  }

  const losersRounds = [];
  const firstRoundLosers = winnersRounds[0].map((match) => getMatchLoser(match, matchWinners[match.id]));

  if (firstRoundLosers.length > 1) {
    losersRounds.push(pairParticipants(firstRoundLosers, (p1, p2, index) => ({
      id: `D-${totalRounds}-L-${index}`,
      stageIndex: totalRounds,
      connectorType: 'none',
      p1,
      p2,
    })));
  }

  for (let winnersRoundIndex = 1; winnersRoundIndex < winnersRounds.length; winnersRoundIndex += 1) {
    const previousLosersRound = losersRounds[losersRounds.length - 1] || [];
    const previousLosersWinners = getRoundWinners(previousLosersRound, matchWinners);
    const droppedFromWinners = winnersRounds[winnersRoundIndex].map((match) => getMatchLoser(match, matchWinners[match.id]));
    const dropStageIndex = totalRounds + losersRounds.length;

    if (previousLosersWinners.length > 0 || droppedFromWinners.length > 0) {
      losersRounds.push(
        previousLosersWinners.map((participant, index) => ({
          id: `D-${dropStageIndex}-L-${index}`,
          stageIndex: dropStageIndex,
          connectorType: 'straight',
          p1: participant || EMPTY_PARTICIPANT,
          p2: droppedFromWinners[index] || EMPTY_PARTICIPANT,
        }))
      );
    }

    const latestLosersRound = losersRounds[losersRounds.length - 1] || [];
    const latestLosersWinners = getRoundWinners(latestLosersRound, matchWinners);

    if (latestLosersWinners.length > 1) {
      const consolidationStageIndex = totalRounds + losersRounds.length;
      losersRounds.push(pairParticipants(latestLosersWinners, (p1, p2, index) => ({
        id: `D-${consolidationStageIndex}-L-${index}`,
        stageIndex: consolidationStageIndex,
        connectorType: 'merge',
        p1,
        p2,
      })));
    }
  }

  const winnersFinalRound = winnersRounds[winnersRounds.length - 1] || [];
  const winnersChampion = matchWinners[winnersFinalRound[0]?.id] || EMPTY_PARTICIPANT;
  const losersFinalRound = losersRounds[losersRounds.length - 1] || [];
  const losersChampion = matchWinners[losersFinalRound[0]?.id] || EMPTY_PARTICIPANT;
  const finalStageIndex = totalRounds + losersRounds.length;
  const grandFinal = {
    id: `D-${finalStageIndex}-F-0`,
    stageIndex: finalStageIndex,
    p1: winnersChampion,
    p2: losersChampion,
    championWinnerIds: [winnersChampion.id, losersChampion.id].filter((id) => id >= 0),
  };

  return { winnersRounds, losersRounds, grandFinal };
};

const FinalConnectorOverlay = ({ layoutRef, winnersFinalRef, losersFinalRef, grandFinalRef }) => {
  const [paths, setPaths] = useState([]);

  useLayoutEffect(() => {
    const updatePaths = () => {
      const layout = layoutRef.current;
      const winnersFinal = winnersFinalRef.current;
      const losersFinal = losersFinalRef.current;
      const grandFinal = grandFinalRef.current;

      if (!layout || !winnersFinal || !losersFinal || !grandFinal) {
        setPaths([]);
        return;
      }

      const layoutRect = layout.getBoundingClientRect();
      const finalRect = grandFinal.getBoundingClientRect();
      const finalLeft = finalRect.left - layoutRect.left;
      const routeX = finalLeft - 28;

      const buildPath = (sourceElement, targetOffset) => {
        const sourceRect = sourceElement.getBoundingClientRect();
        const startX = sourceRect.right - layoutRect.left;
        const startY = sourceRect.top - layoutRect.top + (sourceRect.height / 2);
        const targetY = finalRect.top - layoutRect.top + targetOffset;

        return `M ${startX} ${startY} H ${routeX} V ${targetY} H ${finalLeft}`;
      };

      setPaths([
        buildPath(winnersFinal, 36),
        buildPath(losersFinal, 60),
      ]);
    };

    updatePaths();

    const resizeObserver = new ResizeObserver(updatePaths);
    [layoutRef.current, winnersFinalRef.current, losersFinalRef.current, grandFinalRef.current]
      .filter(Boolean)
      .forEach((element) => resizeObserver.observe(element));

    window.addEventListener('resize', updatePaths);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePaths);
    };
  }, [layoutRef, winnersFinalRef, losersFinalRef, grandFinalRef]);

  if (paths.length === 0) return null;

  return (
    <svg className="double-final-connectors" aria-hidden="true">
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
};

const DoubleBracketSection = ({ title, rounds, setupMode, advanceType, matchWinners, onParticipantUpdate, onWinnerChange, finalMatchRef }) => {
  const matchItemHeight = 96;
  const matchGap = 24;
  const roundHeaderHeight = 56;
  const roundPadding = 32;
  const maxMatches = Math.max(...rounds.map((round) => round.length), 1);
  const matchStackHeight = maxMatches * matchItemHeight + (maxMatches - 1) * matchGap;
  const roundMinHeight = roundHeaderHeight + roundPadding + matchStackHeight;
  const itemStride = matchItemHeight + matchGap;

  const fallbackMatchTop = useCallback((roundIndex, matchIndex) => {
    const roundMatches = rounds[roundIndex]?.length || 1;
    const roundHeight = roundMatches * matchItemHeight + (roundMatches - 1) * matchGap;
    const availableSpace = Math.max(matchStackHeight - roundHeight, 0);
    return availableSpace / 2 + matchIndex * itemStride;
  }, [rounds, itemStride, matchStackHeight]);

  const roundTops = useMemo(() => {
    const nextRoundTops = [];

    rounds.forEach((roundMatches, roundIndex) => {
      if (roundIndex === 0) {
        nextRoundTops[roundIndex] = roundMatches.map((_, matchIndex) => matchIndex * itemStride);
        return;
      }

      nextRoundTops[roundIndex] = roundMatches.map((match, matchIndex) => {
        const previousRoundTops = nextRoundTops[roundIndex - 1] || [];

        if (match.connectorType === 'merge') {
          const firstTop = previousRoundTops[matchIndex * 2];
          const secondTop = previousRoundTops[(matchIndex * 2) + 1];

          if (firstTop !== undefined && secondTop !== undefined) {
            const firstCenter = firstTop + (matchItemHeight / 2);
            const secondCenter = secondTop + (matchItemHeight / 2);
            return ((firstCenter + secondCenter) / 2) - (matchItemHeight / 2);
          }
        }

        if (match.connectorType === 'straight') {
          const previousTop = previousRoundTops[matchIndex];
          if (previousTop !== undefined) return previousTop;
        }

        return fallbackMatchTop(roundIndex, matchIndex);
      });
    });

    return nextRoundTops;
  }, [rounds, itemStride, fallbackMatchTop]);

  const getIncomingVerticalHeight = (roundIndex, matchIndex, match) => {
    if (match.connectorType !== 'merge') return 0;

    const firstTop = roundTops[roundIndex - 1]?.[matchIndex * 2];
    const secondTop = roundTops[roundIndex - 1]?.[(matchIndex * 2) + 1];
    if (firstTop === undefined || secondTop === undefined) return 0;

    return Math.abs(secondTop - firstTop);
  };

  return (
    <section className="double-bracket-section">
      <h2>{title}</h2>
      <div className="bracket double-bracket-row">
        {rounds.map((roundMatches, roundIndex) => (
          <div key={`${title}-${roundIndex}`} className="round" style={{ minHeight: `${roundMinHeight}px` }}>
            <h3>Round {roundIndex + 1}</h3>
            <div className="round-matches" style={{ height: `${matchStackHeight}px` }}>
              {roundMatches.map((match, matchIndex) => (
                <div
                  ref={roundIndex === rounds.length - 1 && matchIndex === 0 ? finalMatchRef : null}
                  key={match.id}
                  className="match"
                  style={{ position: 'absolute', width: '100%', top: `${roundTops[roundIndex]?.[matchIndex] || 0}px` }}
                >
                  <Matchup
                    match={match}
                    roundIndex={match.stageIndex}
                    winner={matchWinners[match.id] || null}
                    isSetup={setupMode}
                    advanceType={advanceType}
                    onWinnerChange={onWinnerChange}
                    onParticipantUpdate={onParticipantUpdate}
                    hasConnector={roundIndex < rounds.length - 1}
                    incomingVerticalHeight={getIncomingVerticalHeight(roundIndex, matchIndex, match)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DoubleEliminationBracket = ({ participants, setupMode, advanceType, matchWinners, onParticipantUpdate, onWinnerChange }) => {
  const { winnersRounds, losersRounds, grandFinal } = useMemo(
    () => buildDoubleEliminationBracket(participants, matchWinners),
    [participants, matchWinners]
  );
  const layoutRef = useRef(null);
  const winnersFinalRef = useRef(null);
  const losersFinalRef = useRef(null);
  const grandFinalRef = useRef(null);

  if (setupMode) {
    return (
      <SingleEliminationBracket
        participants={participants}
        setupMode={setupMode}
        advanceType={advanceType}
        matchWinners={{}}
        onParticipantUpdate={onParticipantUpdate}
        onWinnerChange={onWinnerChange}
      />
    );
  }

  return (
    <div className="double-elim-layout" ref={layoutRef}>
      <FinalConnectorOverlay
        layoutRef={layoutRef}
        winnersFinalRef={winnersFinalRef}
        losersFinalRef={losersFinalRef}
        grandFinalRef={grandFinalRef}
      />
      <div className="double-elim-branches">
        <DoubleBracketSection
          title="Winner's Bracket"
          rounds={winnersRounds}
          setupMode={false}
          advanceType={advanceType}
          matchWinners={matchWinners}
          onParticipantUpdate={onParticipantUpdate}
          onWinnerChange={onWinnerChange}
          finalMatchRef={winnersFinalRef}
        />
        <DoubleBracketSection
          title="Loser's Bracket"
          rounds={losersRounds}
          setupMode={false}
          advanceType={advanceType}
          matchWinners={matchWinners}
          onParticipantUpdate={onParticipantUpdate}
          onWinnerChange={onWinnerChange}
          finalMatchRef={losersFinalRef}
        />
      </div>

      <section className="double-final-section">
        <h2>Grand Final</h2>
        <div className="double-final-match" ref={grandFinalRef}>
          <Matchup
            match={grandFinal}
            roundIndex={grandFinal.stageIndex}
            winner={matchWinners[grandFinal.id] || null}
            isSetup={false}
            advanceType={advanceType}
            onWinnerChange={onWinnerChange}
            onParticipantUpdate={onParticipantUpdate}
            hasConnector={false}
            incomingVerticalHeight={0}
          />
        </div>
      </section>
    </div>
  );
};

const Bracket = React.memo(({ participants, setupMode, bracketType = 'single', advanceType, matchWinners, onParticipantUpdate, onWinnerChange }) => {
  if (bracketType === 'double') {
    return (
      <DoubleEliminationBracket
        participants={participants}
        setupMode={setupMode}
        advanceType={advanceType}
        matchWinners={matchWinners}
        onParticipantUpdate={onParticipantUpdate}
        onWinnerChange={onWinnerChange}
      />
    );
  }

  return (
    <SingleEliminationBracket
      participants={participants}
      setupMode={setupMode}
      advanceType={advanceType}
      matchWinners={matchWinners}
      onParticipantUpdate={onParticipantUpdate}
      onWinnerChange={onWinnerChange}
    />
  );
});

export default Bracket;
