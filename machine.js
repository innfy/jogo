const MachineSystem = (() => {
  const MACHINE_DEFINITIONS = {
    herb_side: {
      id: 'herb_side',
      name: 'Herb-side',
      cost: 150,
      gasType: 'herbicide',
      gasColor: '#ffffff',
      targetCategory: 'weed',
      areaShape: 'square',
      areaSize: 3,
      directional: false,
      shape: 'squareTurret',
      recommendedWaves: [1],
      tickInterval: 2,
      buffsAllies: false
    },
    fungi_llicit: {
      id: 'fungi_llicit',
      name: 'Fungi-llicit',
      cost: 300,
      gasType: 'fungicide',
      gasColor: '#1a1a1a',
      targetCategory: 'fungus',
      areaShape: 'square',
      areaSize: 6,
      directional: false,
      shape: 'hexTurret',
      recommendedWaves: [1],
      tickInterval: 3,
      buffsAllies: true,
      buffType: 'restore',
      buffAmount: 0.15
    },
    insec_cated: {
      id: 'insec_cated',
      name: 'Insec-cated',
      cost: 80,
      gasType: 'insecticide',
      gasColor: '#f4e04d',
      targetCategory: 'insect',
      areaShape: 'line',
      areaLength: 6,
      areaWidth: 0,
      directional: true,
      shape: 'triangleTurret',
      recommendedWaves: [2, 3],
      tickInterval: 1.5,
      buffsAllies: false
    },
    acare_city: {
      id: 'acare_city',
      name: 'Acare-city',
      cost: 180,
      gasType: 'acaricide',
      gasColor: '#3a7bd5',
      targetCategory: 'mite',
      areaShape: 'line',
      areaLength: 4,
      areaWidth: 1,
      directional: true,
      shape: 'diamondTurret',
      recommendedWaves: [3, 4, 5],
      tickInterval: 2,
      buffsAllies: false
    },
    nematondes: {
      id: 'nematondes',
      name: 'Nematondes',
      cost: 160,
      gasType: 'extraction',
      gasColor: '#8b5a2b',
      targetCategory: 'plant_pest',
      areaShape: 'square',
      areaSize: 3,
      directional: false,
      shape: 'circleTurret',
      recommendedWaves: [3, 5],
      tickInterval: 4,
      buffsAllies: true,
      buffType: 'convert',
      mode: 'adubo'
    },
    bat_teries: {
      id: 'bat_teries',
      name: 'Bat-teries',
      cost: 500,
      gasType: 'energy',
      gasColor: '#8e44ad',
      targetCategory: 'waste',
      areaShape: 'square',
      areaSize: 10,
      directional: false,
      shape: 'starTurret',
      recommendedWaves: [4, 5],
      tickInterval: 5,
      buffsAllies: true,
      buffType: 'energy'
    }
  };

  let placedMachines = {};

  function keyOf(x, y) {
    return x + ',' + y;
  }

  function getDefinition(machineId) {
    return MACHINE_DEFINITIONS[machineId] || null;
  }

  function getAllDefinitions() {
    return Object.values(MACHINE_DEFINITIONS);
  }

  function canPlaceMachine(x, y, machineId) {
    const def = getDefinition(machineId);
    if (!def) return false;
    if (!TerrainSystem.canPlaceMachine(x, y)) return false;
    return Economy.canAfford(def.cost);
  }

  function place(x, y, machineId, facing) {
    if (!canPlaceMachine(x, y, machineId)) return false;

    const def = getDefinition(machineId);
    if (!Economy.spendMoney(def.cost)) return false;

    TerrainSystem.placeMachine(x, y, machineId);

    placedMachines[keyOf(x, y)] = {
      x: x,
      y: y,
      machineId: machineId,
      facing: facing || 'right',
      timeSincePulse: 0,
      mode: def.mode || null,
      active: true
    };

    window.dispatchEvent(new CustomEvent('machine:placed', {
      detail: { x: x, y: y, machineId: machineId }
    }));

    return true;
  }

  function remove(x, y) {
    const key = keyOf(x, y);
    if (!placedMachines[key]) return false;

    delete placedMachines[key];
    TerrainSystem.removeMachine(x, y);

    window.dispatchEvent(new CustomEvent('machine:removed', {
      detail: { x: x, y: y }
    }));

    return true;
  }

  function getFacingDelta(facing) {
    if (facing === 'left') return { dx: -1, dy: 0 };
    if (facing === 'up') return { dx: 0, dy: -1 };
    if (facing === 'down') return { dx: 0, dy: 1 };
    return { dx: 1, dy: 0 };
  }

  function getSquareOffsets(size) {
    const offsets = [];
    const start = -Math.floor((size - 1) / 2);
    for (let i = 0; i < size; i++) {
      offsets.push(start + i);
    }
    return offsets;
  }

  function getAreaTiles(machineInstance) {
    const def = getDefinition(machineInstance.machineId);
    const tiles = [];

    if (def.areaShape === 'square') {
      const offsets = getSquareOffsets(def.areaSize);
      for (let i = 0; i < offsets.length; i++) {
        for (let j = 0; j < offsets.length; j++) {
          const tx = machineInstance.x + offsets[j];
          const ty = machineInstance.y + offsets[i];
          if (TerrainSystem.getTile(tx, ty)) {
            tiles.push({ x: tx, y: ty });
          }
        }
      }
      return tiles;
    }

    if (def.areaShape === 'line') {
      const delta = getFacingDelta(machineInstance.facing);
      const length = def.areaLength || 1;
      const width = def.areaWidth || 0;

      for (let step = 1; step <= length; step++) {
        for (let w = -width; w <= width; w++) {
          let tx, ty;
          if (delta.dx !== 0) {
            tx = machineInstance.x + delta.dx * step;
            ty = machineInstance.y + w;
          } else {
            tx = machineInstance.x + w;
            ty = machineInstance.y + delta.dy * step;
          }
          if (TerrainSystem.getTile(tx, ty)) {
            tiles.push({ x: tx, y: ty });
          }
        }
      }
      return tiles;
    }

    return tiles;
  }

  function applyAllyBuff(machineInstance, def, tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i];
      const plantInstance = PlantSystem.getInstance(t.x, t.y);

      if (def.buffType === 'restore' && plantInstance && !plantInstance.matured) {
        plantInstance.growthElapsed += plantInstance.growthTime * def.buffAmount;
      }

      if (def.buffType === 'convert' && plantInstance) {
        window.dispatchEvent(new CustomEvent('machine:pestConverted', {
          detail: { x: t.x, y: t.y, mode: machineInstance.mode }
        }));
      }

      if (def.buffType === 'energy') {
        window.dispatchEvent(new CustomEvent('machine:energyCollected', {
          detail: { x: t.x, y: t.y }
        }));
      }
    }
  }

  function pulse(machineInstance) {
    const def = getDefinition(machineInstance.machineId);
    const tiles = getAreaTiles(machineInstance);

    if (def.targetCategory !== 'plant_pest' && def.targetCategory !== 'waste') {
      window.dispatchEvent(new CustomEvent('machine:pesticideApplied', {
        detail: {
          x: machineInstance.x,
          y: machineInstance.y,
          gasType: def.gasType,
          gasColor: def.gasColor,
          targetCategory: def.targetCategory,
          tiles: tiles
        }
      }));
    }

    if (def.buffsAllies) {
      applyAllyBuff(machineInstance, def, tiles);
    }

    window.dispatchEvent(new CustomEvent('machine:pulse', {
      detail: {
        x: machineInstance.x,
        y: machineInstance.y,
        machineId: machineInstance.machineId,
        tiles: tiles
      }
    }));
  }

  function setMode(x, y, mode) {
    const instance = placedMachines[keyOf(x, y)];
    if (!instance) return false;
    instance.mode = mode;
    return true;
  }

  function setFacing(x, y, facing) {
    const instance = placedMachines[keyOf(x, y)];
    if (!instance) return false;
    instance.facing = facing;
    return true;
  }

  function update(deltaSeconds) {
    for (const key in placedMachines) {
      const instance = placedMachines[key];
      if (!instance.active) continue;

      const def = getDefinition(instance.machineId);
      instance.timeSincePulse += deltaSeconds;

      if (instance.timeSincePulse >= def.tickInterval) {
        instance.timeSincePulse = 0;
        pulse(instance);
      }
    }
  }

  function getInstance(x, y) {
    return placedMachines[keyOf(x, y)] || null;
  }

  function getAllInstances() {
    return Object.values(placedMachines);
  }

  function reset() {
    placedMachines = {};
  }

  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);
  window.addEventListener('timer:tick', () => update(1));

  return {
    getDefinition,
    getAllDefinitions,
    canPlaceMachine,
    place,
    remove,
    getAreaTiles,
    setMode,
    setFacing,
    update,
    getInstance,
    getAllInstances,
    reset
  };
})();