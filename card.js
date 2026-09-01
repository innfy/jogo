const CardDeckSystem = (() => {
  const DECK_TYPES = {
    PLANTS: 'plants',
    MACHINES: 'machines'
  };

  let activeDeck = DECK_TYPES.PLANTS;
  let selectedCardId = null;

  function getDeckCards(deckType) {
    if (deckType === DECK_TYPES.PLANTS) {
      return PlantSystem.getAllDefinitions();
    }
    if (deckType === DECK_TYPES.MACHINES) {
      return MachineSystem.getAllDefinitions();
    }
    return [];
  }

  function switchDeck(deckType) {
    if (deckType !== DECK_TYPES.PLANTS && deckType !== DECK_TYPES.MACHINES) return false;

    activeDeck = deckType;
    selectedCardId = null;

    window.dispatchEvent(new CustomEvent('deck:changed', {
      detail: { activeDeck: activeDeck }
    }));

    return true;
  }

  function selectCard(cardId) {
    const cards = getDeckCards(activeDeck);
    const exists = cards.some((c) => c.id === cardId);
    if (!exists) return false;

    selectedCardId = cardId;

    window.dispatchEvent(new CustomEvent('deck:cardSelected', {
      detail: { activeDeck: activeDeck, selectedCardId: selectedCardId }
    }));

    return true;
  }

  function clearSelection() {
    selectedCardId = null;
    window.dispatchEvent(new CustomEvent('deck:cardSelected', {
      detail: { activeDeck: activeDeck, selectedCardId: null }
    }));
  }

  function getSelectedCard() {
    if (!selectedCardId) return null;
    const cards = getDeckCards(activeDeck);
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id === selectedCardId) return cards[i];
    }
    return null;
  }

  function getActiveDeck() {
    return activeDeck;
  }

  function placeSelectedCard(x, y, facing) {
    const card = getSelectedCard();
    if (!card) return false;

    let success = false;

    if (activeDeck === DECK_TYPES.PLANTS) {
      success = PlantSystem.plant(x, y, card.id);
    } else if (activeDeck === DECK_TYPES.MACHINES) {
      success = MachineSystem.place(x, y, card.id, facing);
    }

    if (success) {
      clearSelection();
    }

    return success;
  }

  function reset() {
    activeDeck = DECK_TYPES.PLANTS;
    selectedCardId = null;
  }

  window.addEventListener('input:tileClick', (e) => {
    const x = e.detail.x;
    const y = e.detail.y;
    const facing = e.detail.facing;
    if (selectedCardId) {
      placeSelectedCard(x, y, facing);
    }
  });

  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);

  return {
    DECK_TYPES,
    getDeckCards,
    switchDeck,
    selectCard,
    clearSelection,
    getSelectedCard,
    getActiveDeck,
    placeSelectedCard
  };
})();