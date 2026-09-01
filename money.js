const Economy = (() => {
  const STARTING_MONEY = 200;

  let money = STARTING_MONEY;

  function getMoney() {
    return money;
  }

  function addMoney(amount) {
    money += amount;
    dispatchChange();
  }

  function spendMoney(amount) {
    if (money < amount) return false;
    money -= amount;
    dispatchChange();
    return true;
  }

  function canAfford(amount) {
    return money >= amount;
  }

  function reset() {
    money = STARTING_MONEY;
    dispatchChange();
  }

  function dispatchChange() {
    window.dispatchEvent(new CustomEvent('economy:change', {
      detail: { money: money }
    }));
  }

  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);

  return {
    getMoney,
    addMoney,
    spendMoney,
    canAfford,
    reset,
    STARTING_MONEY
  };
})();

const PlantSystem = (() => {
  const PLANT_DEFINITIONS = {
    milho: {
      id: 'milho',
      name: 'milho',
      cost: 50,
      growthTime: 15,
      yieldMoney: 80,
      shape: 'hexagon',
      color: '#f4c430',
      seedColor: '#e0a800'
    },
    trigo: {
      id: 'trigo',
      name: 'trigo',
      cost: 30,
      growthTime: 10,
      yieldMoney: 45,
      shape: 'triangleCluster',
      color: '#d9b26a',
      seedColor: '#c9a06a'
    },
    maca: {
      id: 'maca',
      name: 'maca',
      cost: 100,
      growthTime: 25,
      yieldMoney: 180,
      shape: 'circle',
      color: '#d0342c',
      seedColor: '#8b5a2b'
    },
    soja: {
      id: 'soja',
      name: 'soja',
      cost: 40,
      growthTime: 12,
      yieldMoney: 55,
      shape: 'ovalCluster',
      color: '#9acd32',
      seedColor: '#6b8e23'
    },
    algodao: {
      id: 'algodao',
      name: 'algodao',
      cost: 60,
      growthTime: 18,
      yieldMoney: 95,
      shape: 'puffCircle',
      color: '#f5f5f5',
      seedColor: '#dddddd'
    }
  };

  let plantedInstances = {};

  function getDefinition(plantId) {
    return PLANT_DEFINITIONS[plantId] || null;
  }

  function getAllDefinitions() {
    return Object.values(PLANT_DEFINITIONS);
  }

  function keyOf(x, y) {
    return x + ',' + y;
  }

  function canPlant(x, y, plantId) {
    const def = getDefinition(plantId);
    if (!def) return false;

    const tile = TerrainSystem.getTile(x, y);
    if (!tile) return false;
    if (tile.hasPlant) return false;
    if (tile.hasMachine) return false;

    const isTilled = tile.type === TerrainSystem.TILE_TYPES.DIRT;
    const isNearWater = !!tile.hydrated;

    if (!isTilled || !isNearWater) return false;

    return Economy.canAfford(def.cost);
  }

  function plant(x, y, plantId) {
    if (!canPlant(x, y, plantId)) return false;

    const def = getDefinition(plantId);
    if (!Economy.spendMoney(def.cost)) return false;

    TerrainSystem.plantSeed(x, y, plantId);

    plantedInstances[keyOf(x, y)] = {
      x: x,
      y: y,
      plantId: plantId,
      growthElapsed: 0,
      growthTime: def.growthTime,
      matured: false,
      harvestReady: false
    };

    window.dispatchEvent(new CustomEvent('plant:planted', {
      detail: { x: x, y: y, plantId: plantId }
    }));

    return true;
  }

  function update(deltaSeconds) {
    for (const key in plantedInstances) {
      const instance = plantedInstances[key];
      if (instance.matured) continue;

      instance.growthElapsed += deltaSeconds;

      if (instance.growthElapsed >= instance.growthTime) {
        instance.matured = true;
        instance.harvestReady = true;

        window.dispatchEvent(new CustomEvent('plant:matured', {
          detail: { x: instance.x, y: instance.y, plantId: instance.plantId }
        }));
      }
    }
  }

  function harvest(x, y) {
    const key = keyOf(x, y);
    const instance = plantedInstances[key];
    if (!instance) return false;
    if (!instance.harvestReady) return false;

    const def = getDefinition(instance.plantId);
    Economy.addMoney(def.yieldMoney);

    delete plantedInstances[key];
    TerrainSystem.removePlant(x, y);

    window.dispatchEvent(new CustomEvent('plant:harvested', {
      detail: { x: x, y: y, plantId: instance.plantId, amount: def.yieldMoney }
    }));

    return true;
  }

  function getInstance(x, y) {
    return plantedInstances[keyOf(x, y)] || null;
  }

  function getAllInstances() {
    return Object.values(plantedInstances);
  }

  function removeAt(x, y) {
    const key = keyOf(x, y);
    if (!plantedInstances[key]) return false;
    delete plantedInstances[key];
    return true;
  }

  function reset() {
    plantedInstances = {};
  }

  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);
  window.addEventListener('timer:tick', () => update(1));

  window.addEventListener('input:tileClick', (e) => {
    const x = e.detail.x;
    const y = e.detail.y;
    const instance = getInstance(x, y);
    if (instance && instance.harvestReady) {
      harvest(x, y);
    }
  });

  return {
    getDefinition,
    getAllDefinitions,
    canPlant,
    plant,
    update,
    harvest,
    getInstance,
    getAllInstances,
    removeAt,
    reset
  };
})();