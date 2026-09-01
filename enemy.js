const EnemyDefinitions = (() => {
  const INSECTS = {
    lagarta: {
      id: 'lagarta',
      name: 'lagarta',
      category: 'insect',
      hp: 20,
      speed: 0.4,
      size: 1,
      damage: 10,
      moneyDrop: 5,
      shape: 'segmentedOval',
      color: '#7a9c3f',
      canJump: false,
      isTank: false
    },
    gafanhoto: {
      id: 'gafanhoto',
      name: 'gafanhoto',
      category: 'insect',
      hp: 15,
      speed: 0.9,
      size: 1,
      damage: 8,
      moneyDrop: 6,
      shape: 'angledLeg',
      color: '#6ab04c',
      canJump: false,
      isTank: false
    },
    grilo: {
      id: 'grilo',
      name: 'grilo',
      category: 'insect',
      hp: 12,
      speed: 0.8,
      size: 1,
      damage: 6,
      moneyDrop: 6,
      shape: 'roundLeg',
      color: '#3d5c2e',
      canJump: true,
      jumpDistance: 2,
      isTank: false
    },
    besouro: {
      id: 'besouro',
      name: 'besouro',
      category: 'insect',
      hp: 60,
      speed: 0.3,
      size: 1,
      damage: 14,
      moneyDrop: 12,
      shape: 'shell',
      color: '#2f2f2f',
      canJump: false,
      isTank: true,
      blocksFollowers: true
    }
  };

  const PARASITE_TYPES = {
    pulga: {
      id: 'pulga',
      name: 'pulga',
      color: '#6b4226',
      requiredGas: ['insecticide'],
      requiresCombo: false
    },
    carrapato: {
      id: 'carrapato',
      name: 'carrapato',
      color: '#111111',
      requiredGas: ['acaricide'],
      requiresCombo: false
    },
    acaro: {
      id: 'acaro',
      name: 'acaro',
      color: '#c0392b',
      requiredGas: ['insecticide', 'acaricide'],
      requiresCombo: true
    },
    berne: {
      id: 'berne',
      name: 'berne',
      color: '#f5f5f5',
      requiredGas: ['insecticide', 'acaricide'],
      requiresCombo: true
    }
  };

  const HOSTS = {
    rato: {
      id: 'rato',
      name: 'rato',
      category: 'host',
      hp: 999999,
      speed: 0.6,
      size: 1,
      damage: 5,
      moneyDrop: 15,
      shape: 'rodent',
      color: '#8a7967',
      minParasites: 1,
      maxParasites: 3,
      invulnerableBody: true
    }
  };

  const EEI = {
    javali_pequeno: {
      id: 'javali_pequeno',
      name: 'javali_pequeno',
      category: 'eei',
      hp: 999999,
      speed: 0.7,
      size: 1,
      damage: 20,
      moneyDrop: 20,
      shape: 'tuskSmall',
      color: '#5c4436',
      minParasites: 2,
      maxParasites: 4,
      invulnerableBody: true,
      eatsPath: true,
      destroysMachines: true,
      walksOnMud: true
    },
    javali_medio: {
      id: 'javali_medio',
      name: 'javali_medio',
      category: 'eei',
      hp: 999999,
      speed: 0.5,
      size: 2,
      damage: 30,
      moneyDrop: 35,
      shape: 'tuskMedium',
      color: '#4a3327',
      minParasites: 3,
      maxParasites: 5,
      invulnerableBody: true,
      eatsPath: true,
      destroysMachines: true,
      walksOnMud: true
    },
    javali_grande: {
      id: 'javali_grande',
      name: 'javali_grande',
      category: 'eei',
      hp: 999999,
      speed: 0.35,
      size: 3,
      damage: 45,
      moneyDrop: 55,
      shape: 'tuskLarge',
      color: '#3a281c',
      minParasites: 4,
      maxParasites: 6,
      invulnerableBody: true,
      eatsPath: true,
      destroysMachines: true,
      walksOnMud: true
    }
  };

  const WEED = {
    erva_daninha: {
      id: 'erva_daninha',
      name: 'erva_daninha',
      category: 'weed',
      hp: 10,
      moneyDrop: 0,
      shape: 'sprig',
      color: '#4c6b1f',
      damagePerTick: 5,
      stationary: true
    }
  };

  const TRASH = {
    lixo_organico: {
      id: 'lixo_organico',
      name: 'lixo_organico',
      category: 'waste',
      hp: 1,
      shape: 'blobSmall',
      color: '#6d4c41',
      energyValue: 10,
      blocksTile: true
    },
    lixo_metal: {
      id: 'lixo_metal',
      name: 'lixo_metal',
      category: 'waste',
      hp: 1,
      shape: 'blobJagged',
      color: '#78909c',
      energyValue: 25,
      blocksTile: true
    },
    lixo_plastico: {
      id: 'lixo_plastico',
      name: 'lixo_plastico',
      category: 'waste',
      hp: 1,
      shape: 'blobFlat',
      color: '#e0a800',
      energyValue: 15,
      blocksTile: true
    }
  };

  const BOSSES = {
    plaguest: {
      id: 'plaguest',
      name: 'plaguest',
      category: 'boss_insect',
      segmentCount: 8,
      segmentHp: 25,
      speed: 0.35,
      damage: 25,
      moneyDrop: 200,
      shape: 'centipedeSegment',
      color: '#1f3d0f',
      wave: 2
    },
    javalao: {
      id: 'javalao',
      name: 'javalao',
      category: 'boss_eei',
      hp: 999999,
      speed: 0.2,
      size: 4,
      damage: 60,
      moneyDrop: 400,
      shape: 'tuskHuge',
      color: '#2a1c12',
      minParasites: 8,
      maxParasites: 12,
      invulnerableBody: true,
      eatsPath: true,
      destroysMachines: true,
      walksOnMud: true,
      wave: 4
    }
  };

  return {
    INSECTS,
    PARASITE_TYPES,
    HOSTS,
    EEI,
    WEED,
    TRASH,
    BOSSES
  };
})();

const EnemyPathing = (() => {
  function isTileWalkable(x, y, options) {
    const tile = TerrainSystem.getTile(x, y);
    if (!tile) return false;
    if (tile.type === TerrainSystem.TILE_TYPES.ROCK) return false;
    if (tile.type === TerrainSystem.TILE_TYPES.WATER) return false;
    if (tile.type === TerrainSystem.TILE_TYPES.MUD && options && options.avoidMud) return false;
    return true;
  }

  function chooseNextStep(x, y, options) {
    const opts = options || {};
    const candidates = [];

    const forward = { x: x + 1, y: y };
    if (isTileWalkable(forward.x, forward.y, opts)) {
      candidates.push({ dx: 1, dy: 0, weight: 6 });
    }

    const up = { x: x, y: y - 1 };
    if (isTileWalkable(up.x, up.y, opts)) {
      candidates.push({ dx: 0, dy: -1, weight: 1 });
    }

    const down = { x: x, y: y + 1 };
    if (isTileWalkable(down.x, down.y, opts)) {
      candidates.push({ dx: 0, dy: 1, weight: 1 });
    }

    const diagUp = { x: x + 1, y: y - 1 };
    if (isTileWalkable(diagUp.x, diagUp.y, opts)) {
      candidates.push({ dx: 1, dy: -1, weight: 2 });
    }

    const diagDown = { x: x + 1, y: y + 1 };
    if (isTileWalkable(diagDown.x, diagDown.y, opts)) {
      candidates.push({ dx: 1, dy: 1, weight: 2 });
    }

    if (candidates.length === 0) {
      return { dx: 0, dy: 0 };
    }

    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const c of candidates) {
      roll -= c.weight;
      if (roll <= 0) return c;
    }

    return candidates[0];
  }

  function chooseJumpStep(x, y, jumpDistance) {
    const targetX = x + jumpDistance;
    const rowOffsets = [0, -1, 1];

    for (const dy of rowOffsets) {
      const ty = y + dy;
      const tile = TerrainSystem.getTile(targetX, ty);
      if (tile && tile.type !== TerrainSystem.TILE_TYPES.WATER) {
        return { toX: targetX, toY: ty };
      }
    }

    return { toX: x + 1, toY: y };
  }

  function findAdjacentEatablePathTile(x, y) {
    const candidates = [
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ];

    for (const c of candidates) {
      const tile = TerrainSystem.getTile(c.x, c.y);
      if (!tile) continue;
      if (tile.type === TerrainSystem.TILE_TYPES.BUSH) return c;
      if (tile.type === TerrainSystem.TILE_TYPES.GRASS) return c;
      if (tile.hasPlant) return c;
    }
    return null;
  }

  return {
    isTileWalkable,
    chooseNextStep,
    chooseJumpStep,
    findAdjacentEatablePathTile
  };
})();

const EnemySystem = (() => {
  let enemies = [];
  let nextId = 1;
  const MIN_FOLLOW_DISTANCE = 0.6;
  const TILE_TRAVEL_TIME_BASE = 1;

  function spawnEnemy(config) {
    const spawnTiles = TerrainSystem.getSpawnTiles();
    if (spawnTiles.length === 0) return null;

    const spawnTile = config.spawnTile || spawnTiles[Math.floor(Math.random() * spawnTiles.length)];

    const enemy = {
      instanceId: nextId++,
      typeId: config.typeId,
      category: config.category,
      x: spawnTile.x,
      y: spawnTile.y,
      pixelProgress: 0,
      hp: config.hp,
      maxHp: config.hp,
      speed: config.speed,
      size: config.size || 1,
      damage: config.damage,
      moneyDrop: config.moneyDrop,
      shape: config.shape,
      color: config.color,
      canJump: !!config.canJump,
      jumpDistance: config.jumpDistance || 0,
      isTank: !!config.isTank,
      blocksFollowers: !!config.blocksFollowers,
      invulnerableBody: !!config.invulnerableBody,
      eatsPath: !!config.eatsPath,
      destroysMachines: !!config.destroysMachines,
      walksOnMud: !!config.walksOnMud,
      alive: true,
      reachedEnd: false,
      moveTimer: 0,
      parasiteHostId: config.parasiteHostId || null,
      isBossSegment: !!config.isBossSegment,
      bossId: config.bossId || null,
      segmentIndex: config.segmentIndex || 0,
      followTargetId: config.followTargetId || null
    };

    enemies.push(enemy);

    window.dispatchEvent(new CustomEvent('enemy:spawned', {
      detail: { instanceId: enemy.instanceId, typeId: enemy.typeId, x: enemy.x, y: enemy.y }
    }));

    return enemy;
  }

  function getEnemyAt(x, y, excludeId) {
    return enemies.find((e) => e.alive && e.x === x && e.y === y && e.instanceId !== excludeId) || null;
  }

  function getBlockingTankAhead(enemy) {
    return enemies.find((e) =>
      e.alive &&
      e.instanceId !== enemy.instanceId &&
      e.blocksFollowers &&
      e.x === enemy.x + 1 &&
      e.y === enemy.y
    ) || null;
  }

  function applyDamage(enemy, amount) {
    if (!enemy.alive) return;
    if (enemy.invulnerableBody) return;

    enemy.hp -= amount;

    if (enemy.hp <= 0) {
      killEnemy(enemy);
    }
  }

  function killEnemy(enemy) {
    if (!enemy.alive) return;
    enemy.alive = false;

    Economy.addMoney(enemy.moneyDrop);

    window.dispatchEvent(new CustomEvent('enemy:killed', {
      detail: { instanceId: enemy.instanceId, typeId: enemy.typeId, x: enemy.x, y: enemy.y }
    }));

    if (enemy.isBossSegment) {
      window.dispatchEvent(new CustomEvent('boss:segmentKilled', {
        detail: { bossId: enemy.bossId, instanceId: enemy.instanceId, segmentIndex: enemy.segmentIndex }
      }));
    }
  }

  function removeEnemy(enemy) {
    enemy.alive = false;
    enemies = enemies.filter((e) => e.instanceId !== enemy.instanceId);
  }

  function tryEatTile(enemy) {
    const target = EnemyPathing.findAdjacentEatablePathTile(enemy.x, enemy.y);
    if (!target) return;

    const tile = TerrainSystem.getTile(target.x, target.y);
    if (!tile) return;

    if (tile.hasPlant) {
      PlantSystem.removeAt(target.x, target.y);
      TerrainSystem.removePlant(target.x, target.y);
    } else if (tile.type === TerrainSystem.TILE_TYPES.BUSH) {
      TerrainSystem.eatBush(target.x, target.y);
    }

    window.dispatchEvent(new CustomEvent('enemy:ateTile', {
      detail: { instanceId: enemy.instanceId, x: target.x, y: target.y }
    }));
  }

  function tryDestroyMachineAt(x, y) {
    const tile = TerrainSystem.getTile(x, y);
    if (!tile || !tile.hasMachine) return;

    MachineSystem.remove(x, y);

    window.dispatchEvent(new CustomEvent('machine:destroyedByEnemy', {
      detail: { x: x, y: y }
    }));
  }

  function stepEnemy(enemy, deltaSeconds) {
    if (!enemy.alive) return;

    if (enemy.blocksFollowers === false) {
      const tank = getBlockingTankAhead(enemy);
      if (tank) return;
    }

    enemy.moveTimer += deltaSeconds * enemy.speed;

    if (enemy.moveTimer < TILE_TRAVEL_TIME_BASE) return;
    enemy.moveTimer = 0;

    const fromX = enemy.x;
    const fromY = enemy.y;

    if (enemy.destroysMachines) {
      tryDestroyMachineAt(fromX + 1, fromY);
    }

    if (enemy.eatsPath) {
      tryEatTile(enemy);
    }

    if (enemy.canJump) {
      const jump = EnemyPathing.chooseJumpStep(fromX, fromY, enemy.jumpDistance);
      enemy.x = jump.toX;
      enemy.y = jump.toY;
    } else {
      const step = EnemyPathing.chooseNextStep(fromX, fromY, { avoidMud: !enemy.walksOnMud });
      enemy.x = fromX + step.dx;
      enemy.y = fromY + step.dy;
    }

    if (enemy.x !== fromX || enemy.y !== fromY) {
      TerrainSystem.recordEnemyPass(fromX, fromY, enemy.x, enemy.y);
    }

    const blockingOccupant = getEnemyAt(enemy.x, enemy.y, enemy.instanceId);
    if (blockingOccupant && blockingOccupant.blocksFollowers) {
      enemy.x = fromX;
      enemy.y = fromY;
    }

    if (TerrainSystem.checkPlantationReached(enemy.x, enemy.y)) {
      enemy.reachedEnd = true;
      window.dispatchEvent(new CustomEvent('enemy:reachedPlantation', {
        detail: { instanceId: enemy.instanceId, typeId: enemy.typeId, damage: enemy.damage }
      }));
      removeEnemy(enemy);
    }
  }

  function update(deltaSeconds) {
    const snapshot = [...enemies];
    for (const enemy of snapshot) {
      stepEnemy(enemy, deltaSeconds);
    }
  }

  function handlePesticide(e) {
    const detail = e.detail;
    const tileSet = new Set(detail.tiles.map((t) => t.x + ',' + t.y));

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (!tileSet.has(enemy.x + ',' + enemy.y)) continue;
      if (enemy.category !== detail.targetCategory) continue;

      applyDamage(enemy, 999);
    }
  }

  function getAllEnemies() {
    return enemies.filter((e) => e.alive);
  }

  function getEnemiesInTiles(tiles) {
    const tileSet = new Set(tiles.map((t) => t.x + ',' + t.y));
    return enemies.filter((e) => e.alive && tileSet.has(e.x + ',' + e.y));
  }

  function getEnemyById(instanceId) {
    return enemies.find((e) => e.instanceId === instanceId) || null;
  }

  function reset() {
    enemies = [];
    nextId = 1;
  }

  window.addEventListener('machine:pesticideApplied', handlePesticide);
  window.addEventListener('timer:tick', () => update(1));
  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);

  return {
    spawnEnemy,
    applyDamage,
    killEnemy,
    removeEnemy,
    getEnemyAt,
    getAllEnemies,
    getEnemiesInTiles,
    getEnemyById,
    update,
    reset
  };
})();

const ParasiteHostSystem = (() => {
  const COMBO_WINDOW_SECONDS = 1.5;

  let hosts = {};

  function createParasite(typeId) {
    const def = EnemyDefinitions.PARASITE_TYPES[typeId];
    return {
      typeId: typeId,
      color: def.color,
      requiredGas: def.requiredGas,
      requiresCombo: def.requiresCombo,
      alive: true,
      recentHits: {}
    };
  }

  function attachHostToEnemy(enemy, minCount, maxCount) {
    const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
    const types = Object.keys(EnemyDefinitions.PARASITE_TYPES);
    const parasites = [];

    for (let i = 0; i < count; i++) {
      const typeId = types[Math.floor(Math.random() * types.length)];
      parasites.push(createParasite(typeId));
    }

    hosts[enemy.instanceId] = {
      hostInstanceId: enemy.instanceId,
      parasites: parasites,
      fled: false
    };

    window.dispatchEvent(new CustomEvent('parasite:hostRegistered', {
      detail: { hostInstanceId: enemy.instanceId, parasites: parasites.map((p) => p.typeId) }
    }));
  }

  function getHostRecord(hostInstanceId) {
    return hosts[hostInstanceId] || null;
  }

  function countAliveParasites(hostRecord) {
    return hostRecord.parasites.filter((p) => p.alive).length;
  }

  function applyGasToHost(hostInstanceId, gasType) {
    const record = hosts[hostInstanceId];
    if (!record || record.fled) return;

    const now = Date.now();

    for (const parasite of record.parasites) {
      if (!parasite.alive) continue;
      if (!parasite.requiredGas.includes(gasType)) continue;

      if (!parasite.requiresCombo) {
        parasite.alive = false;
        dispatchParasiteKilled(hostInstanceId, parasite);
        continue;
      }

      parasite.recentHits[gasType] = now;

      const hasAllRecent = parasite.requiredGas.every((g) => {
        const t = parasite.recentHits[g];
        return t && (now - t) <= COMBO_WINDOW_SECONDS * 1000;
      });

      if (hasAllRecent) {
        parasite.alive = false;
        dispatchParasiteKilled(hostInstanceId, parasite);
      }
    }

    checkHostCleared(hostInstanceId);
  }

  function dispatchParasiteKilled(hostInstanceId, parasite) {
    window.dispatchEvent(new CustomEvent('parasite:killed', {
      detail: { hostInstanceId: hostInstanceId, typeId: parasite.typeId }
    }));
  }

  function checkHostCleared(hostInstanceId) {
    const record = hosts[hostInstanceId];
    if (!record || record.fled) return;

    if (countAliveParasites(record) === 0) {
      record.fled = true;

      const hostEnemy = EnemySystem.getEnemyById(hostInstanceId);

      window.dispatchEvent(new CustomEvent('parasite:hostCleared', {
        detail: { hostInstanceId: hostInstanceId }
      }));

      if (hostEnemy) {
        if (hostEnemy.category === 'boss_eei') {
          window.dispatchEvent(new CustomEvent('boss:fled', {
            detail: { instanceId: hostInstanceId, bossId: hostEnemy.typeId }
          }));
        }
        EnemySystem.killEnemy(hostEnemy);
      }
    }
  }

  function handlePesticide(e) {
    const detail = e.detail;
    if (detail.targetCategory !== 'insect' && detail.targetCategory !== 'mite') return;

    const gasTypeMap = {
      insecticide: 'insecticide',
      acaricide: 'acaricide'
    };

    const gasType = gasTypeMap[detail.gasType];
    if (!gasType) return;

    const enemiesInArea = EnemySystem.getEnemiesInTiles(detail.tiles);

    for (const enemy of enemiesInArea) {
      if (hosts[enemy.instanceId]) {
        applyGasToHost(enemy.instanceId, gasType);
      }
    }
  }

  function removeHost(hostInstanceId) {
    delete hosts[hostInstanceId];
  }

  function reset() {
    hosts = {};
  }

  window.addEventListener('machine:pesticideApplied', handlePesticide);
  window.addEventListener('enemy:killed', (e) => removeHost(e.detail.instanceId));
  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);

  return {
    attachHostToEnemy,
    getHostRecord,
    countAliveParasites,
    applyGasToHost,
    removeHost,
    reset
  };
})();

const WeedSystem = (() => {
  const SPAWN_INTERVAL_SECONDS = 4;
  const DAMAGE_TICK_INTERVAL = 2;

  let weedInstances = {};
  let spawnTimer = 0;
  let active = false;

  function keyOf(x, y) {
    return x + ',' + y;
  }

  function isEligibleTile(tile) {
    if (!tile) return false;
    const validTypes = [
      TerrainSystem.TILE_TYPES.DIRT,
      TerrainSystem.TILE_TYPES.SOIL,
      TerrainSystem.TILE_TYPES.MUD
    ];
    return validTypes.includes(tile.type);
  }

  function trySpawnWeed() {
    const grid = TerrainSystem.getGrid();
    const eligible = [];

    for (let y = 0; y < TerrainSystem.GRID_ROWS; y++) {
      for (let x = 0; x < TerrainSystem.GRID_COLS; x++) {
        const tile = grid[y][x];
        if (isEligibleTile(tile) && !weedInstances[keyOf(x, y)]) {
          eligible.push({ x, y });
        }
      }
    }

    if (eligible.length === 0) return;

    const spot = eligible[Math.floor(Math.random() * eligible.length)];
    const def = EnemyDefinitions.WEED.erva_daninha;

    weedInstances[keyOf(spot.x, spot.y)] = {
      x: spot.x,
      y: spot.y,
      hp: def.hp,
      maxHp: def.hp,
      damageTimer: 0,
      alive: true
    };

    window.dispatchEvent(new CustomEvent('weed:spawned', {
      detail: { x: spot.x, y: spot.y }
    }));
  }

  function damagePlantUnder(x, y) {
    const plantInstance = PlantSystem.getInstance(x, y);
    if (!plantInstance) return;

    plantInstance.growthElapsed -= EnemyDefinitions.WEED.erva_daninha.damagePerTick;
    if (plantInstance.growthElapsed < 0) plantInstance.growthElapsed = 0;

    window.dispatchEvent(new CustomEvent('weed:damagedPlant', {
      detail: { x: x, y: y }
    }));
  }

  function update(deltaSeconds) {
    if (!active) return;

    spawnTimer += deltaSeconds;
    if (spawnTimer >= SPAWN_INTERVAL_SECONDS) {
      spawnTimer = 0;
      trySpawnWeed();
    }

    for (const key in weedInstances) {
      const weed = weedInstances[key];
      if (!weed.alive) continue;

      weed.damageTimer += deltaSeconds;
      if (weed.damageTimer >= DAMAGE_TICK_INTERVAL) {
        weed.damageTimer = 0;
        damagePlantUnder(weed.x, weed.y);
      }
    }
  }

  function handlePesticide(e) {
    const detail = e.detail;
    if (detail.targetCategory !== 'weed') return;

    for (const tile of detail.tiles) {
      const key = keyOf(tile.x, tile.y);
      const weed = weedInstances[key];
      if (weed && weed.alive) {
        weed.alive = false;
        delete weedInstances[key];

        window.dispatchEvent(new CustomEvent('weed:killed', {
          detail: { x: tile.x, y: tile.y }
        }));
      }
    }
  }

  function setActive(state) {
    active = state;
    if (state) {
      spawnTimer = 0;
      weedInstances = {};
    }
  }

  function reset() {
    weedInstances = {};
    spawnTimer = 0;
    active = false;
  }

  window.addEventListener('machine:pesticideApplied', handlePesticide);
  window.addEventListener('timer:tick', () => update(1));

  window.addEventListener('timer:waveStart', (e) => {
    setActive(e.detail.wave === 1);
  });

  window.addEventListener('game:start', reset);
  window.addEventListener('game:restart', reset);

  return {
    trySpawnWeed,
    update,
    setActive,
    reset,
    getAllWeeds: () => Object.values(weedInstances)
  };
})();