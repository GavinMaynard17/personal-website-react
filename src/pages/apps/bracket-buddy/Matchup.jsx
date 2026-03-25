import React, { useRef, useState } from 'react';
import './Matchup.scss';

const Matchup = ({ match, roundIndex, winner, isSetup, advanceType, onWinnerChange, onParticipantUpdate, hasConnector, incomingVerticalHeight }) => {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [previewParticipant, setPreviewParticipant] = useState(null);

  const isPictureMode = advanceType === 'picture';
  const bothImagesAvailable = match.p1?.image && match.p2?.image;

  const verticalHeight = incomingVerticalHeight !== undefined ? incomingVerticalHeight : (roundIndex > 0 ? 120 : 0);


  const handleMatchupClick = (e) => {
    if (isSetup || !isPictureMode || !bothImagesAvailable) return;
    // only open modal if click is on the card itself, not on buttons
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPreviewParticipant(null);
  };

  const handleModalSelect = (participant) => {
    handleWinner(participant);
    setShowModal(false);
    setPreviewParticipant(null);
  };

  const handlePreviewOpen = (participant) => {
    setPreviewParticipant(participant);
  };

  const handlePreviewClose = () => {
    setPreviewParticipant(null);
  };

  const handleWinner = (chosen) => {
    if (isSetup) return;
    const currentWinner = winner?.id;
    const selectedId = chosen?.id;
    onWinnerChange(roundIndex, Number(match.id.split('-')[1]), currentWinner === selectedId ? null : chosen);
  };

  const uploadImage = (participantKey, file) => {
    if (file && match[participantKey]?.id >= 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onParticipantUpdate(match[participantKey].id, 'image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onNameChange = (participantKey, value) => {
    if (match[participantKey]?.id >= 0) {
      onParticipantUpdate(match[participantKey].id, 'name', value);
    }
  };

  const renderParticipantRow = (participantKey) => {
    const participant = match[participantKey] || { id: -1, name: '', image: null };
    const selected = winner && winner.id === participant.id;
    const canSelect = !isSetup && match.p1?.name && match.p2?.name;
    const isPictureMode = advanceType === 'picture';
    const isPictureSetupRow = isPictureMode && roundIndex === 0 && isSetup;

    let imageAction = null;
    if (isPictureMode) {
      if (participant.image) {
        imageAction = (
          <span className="participant-thumbnail">
            <img src={participant.image} alt="participant" />
          </span>
        );
      } else if (isPictureSetupRow) {
        imageAction = (
          <button
            className="image-button"
            type="button"
            onClick={(e) => { e.stopPropagation(); (participantKey === 'p1' ? fileInputRef1 : fileInputRef2).current.click(); }}
          >
            <span>Add</span>
          </button>
        );
      }
    }

    return (
      <div className={`participant-row ${selected ? 'selected' : ''}`}>
        {imageAction}

        {roundIndex === 0 && isSetup ? (
          <input
            className="participant-input"
            value={participant.name}
            onChange={(e) => onNameChange(participantKey, e.target.value)}
            placeholder="Participant name"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="participant-label">
            {participant.name || '-'}
          </span>
        )}

        <input
          ref={participantKey === 'p1' ? fileInputRef1 : fileInputRef2}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => uploadImage(participantKey, e.target.files?.[0])}
        />

        {!isSetup && (participant.name || participant.image) && (
          <button
            type="button"
            className={`win-btn ${selected ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleWinner(participant); }}
            disabled={!canSelect}
          >
            {advanceType === 'picture' ? '📸' : '✓'}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="matchup-card-wrapper" style={{ position: 'relative' }}>
        {roundIndex > 0 && (
          <div
            className="incoming-vertical-line"
            style={{
              height: `${verticalHeight}px`,
              top: `calc(50% - ${verticalHeight / 2}px)`,
            }}
          />
        )}

        {roundIndex > 0 && <div className="incoming-horizontal-line" />}
        {hasConnector && <div className="outgoing-horizontal-line" />}

        <div
          className={`matchup-card ${hasConnector ? 'connector' : ''}`}
          onClick={handleMatchupClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleMatchupClick(e); }}
        >
          {renderParticipantRow('p1')}
          {renderParticipantRow('p2')}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Choose a winner</h4>
            <div className="modal-selection">
              <button className="image-select" onClick={() => handleModalSelect(match.p1)}>
                <span className="image-select-media">
                  <img src={match.p1.image} alt={match.p1.name || 'P1'} />
                  <button
                    type="button"
                    className="image-preview-btn"
                    aria-label={`Preview ${match.p1.name || 'first option'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewOpen(match.p1);
                    }}
                  >
                    Expand
                  </button>
                </span>
                <span>{match.p1.name || '-'}</span>
              </button>
              <button className="image-select" onClick={() => handleModalSelect(match.p2)}>
                <span className="image-select-media">
                  <img src={match.p2.image} alt={match.p2.name || 'P2'} />
                  <button
                    type="button"
                    className="image-preview-btn"
                    aria-label={`Preview ${match.p2.name || 'second option'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewOpen(match.p2);
                    }}
                  >
                    Expand
                  </button>
                </span>
                <span>{match.p2.name || '-'}</span>
              </button>
            </div>

            {previewParticipant?.image && (
              <div className="image-preview-overlay" onClick={handlePreviewClose}>
                <div className="image-preview-dialog" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="image-preview-close"
                    onClick={handlePreviewClose}
                  >
                    Close
                  </button>
                  <img
                    className="image-preview-full"
                    src={previewParticipant.image}
                    alt={previewParticipant.name || 'Preview'}
                  />
                  <p className="image-preview-name">{previewParticipant.name || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Matchup;
