const TerrainSystem = (() => {
  const GRID_COLS = 20;
  const GRID_ROWS = 10;
  const PLANTATION_COL = GRID_COLS - 1;
  const SPAWN_COL = 0;

  const TILE_TYPES = {
    GRASS: 'grass',
    DIRT: 'dirt',
    SOIL: 'soil',
    MUD: 'mud',
    TRAIL: 'trail',
    ROCK: 'rock',
    WATER: 'water',
    BUSH: 'bush'
  };

  const TILE_COLORS = {
    grass: '#8fd14f',
    dirt: '#c9a06a',
    soil: '#8b5a2b',
    mud: '#4a2e12',
    trail: '#a97c50',
    rock: '#9a9a9a',
    water: '#3a7bd5',
    bush: '#2f5d2a'
  };

  const TRAMPLE_TO_DIRT_THRESHOLD = 3;
  const TRAMPLE_TO_TRAIL_THRESHOLD = 8;
  const MUD_WATER_EXCESS_THRESHOLD = 4;
  const MUD_TO_SOIL_DRY_THRESHOLD = 3;
  const BUSH_TO_GRASS_GROWTH_THRESHOLD = 6;

  const DIRECTION_ARROWS = {
    '1,0': '→',
    '-1,0': '←',
    '0,1': '↓',
    '0,-1': '↑',
    '1,1': '↘',
    '1,-1': '↗',
    '-1,1': '↙',
    '-1,-1': '↖'
  };

  let grid = [];

  function createEmptyTile(x, y) {
    return {
      x,
      y,
      type: TILE_TYPES.GRASS,
      hasPlant: false,
      plantType: null,
      hasMachine: false,
      machineType: null,
      waterLevel: 0,
      hydrated: false,
      trampleCount: 0,
      trailDirection: null,
      growthTimer: 0,
      dryTimer: 0,
      age: 0
    };
  }

  function inBounds(x, y) {
    return x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS;
  }

  function getTile(x, y) {
    if (!inBounds(x, y)) return null;
    return grid[y][x];
  }

  function forEachNeighbor(x, y, callback) {
    const deltas = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx, dy] of deltas) {
      const nx = x + dx;
      const ny = y + dy;
      if (inBounds(nx, ny)) callback(grid[ny][nx], dx, dy);
    }
  }

  function generate() {
    grid = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      const row = [];
      for (let x = 0; x < GRID_COLS; x++) {
        row.push(createEmptyTile(x, y));
      }
      grid.push(row);
    }

    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 25) {
      resetToGrass();
      scatterRocks();
      scatterWaterPools();
      scatterBushes();
      valid = hasWalkablePath();
      attempts++;
    }

    if (!valid) {
      forceOpenPath();
    }

    applyHydration();

    window.dispatchEvent(new CustomEvent('terrain:generated', {
      detail: { cols: GRID_COLS, rows: GRID_ROWS }
    }));
  }

  function resetToGrass() {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        grid[y][x] = createEmptyTile(x, y);
      }
    }
  }

  function scatterRocks() {
    const rockCount = Math.floor(GRID_COLS * GRID_ROWS * 0.05);
    let placed = 0;
    let safety = 0;
    while (placed < rockCount && safety < rockCount * 20) {
      safety++;
      const x = Math.floor(Math.random() * GRID_COLS);
      const y = Math.floor(Math.random() * GRID_ROWS);
      if (x === SPAWN_COL || x === PLANTATION_COL) continue;
      const tile = grid[y][x];
      if (tile.type !== TILE_TYPES.GRASS) continue;
      tile.type = TILE_TYPES.ROCK;
      placed++;
      if (Math.random() < 0.35) {
        const dx = Math.random() < 0.5 ? 1 : -1;
        const dy = Math.random() < 0.5 ? 1 : -1;
        const nx = x + (Math.random() < 0.5 ? dx : 0);
        const ny = y + (Math.random() < 0.5 ? 0 : dy);
        if (inBounds(nx, ny) && nx !== SPAWN_COL && nx !== PLANTATION_COL) {
          const neighbor = grid[ny][nx];
          if (neighbor.type === TILE_TYPES.GRASS) {
            neighbor.type = TILE_TYPES.ROCK;
            placed++;
          }
        }
      }
    }
  }

  function scatterWaterPools() {
    const poolCount = 2 + Math.floor(Math.random() * 2);
    for (let p = 0; p < poolCount; p++) {
      const cx = 2 + Math.floor(Math.random() * (GRID_COLS - 4));
      const cy = Math.floor(Math.random() * GRID_ROWS);
      const poolSize = 2 + Math.floor(Math.random() * 3);
      const queue = [[cx, cy]];
      const visited = new Set();
      let filled = 0;

      while (queue.length > 0 && filled < poolSize) {
        const [x, y] = queue.shift();
        const key = `${x},${y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (!inBounds(x, y)) continue;
        if (x === SPAWN_COL || x === PLANTATION_COL) continue;

        const tile = grid[y][x];
        if (tile.type !== TILE_TYPES.GRASS) continue;

        tile.type = TILE_TYPES.WATER;
        filled++;

        const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
        for (const n of neighbors) {
          if (Math.random() < 0.6) queue.push(n);
        }
      }
    }
  }

  function scatterBushes() {
    const clusterCount = 4 + Math.floor(Math.random() * 3);
    for (let c = 0; c < clusterCount; c++) {
      const cx = Math.floor(Math.random() * GRID_COLS);
      const cy = Math.floor(Math.random() * GRID_ROWS);
      const clusterSize = 1 + Math.floor(Math.random() * 3);
      const queue = [[cx, cy]];
      const visited = new Set();
      let filled = 0;

      while (queue.length > 0 && filled < clusterSize) {
        const [x, y] = queue.shift();
        const key = `${x},${y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (!inBounds(x, y)) continue;

        const tile = grid[y][x];
        if (tile.type !== TILE_TYPES.GRASS) continue;

        tile.type = TILE_TYPES.BUSH;
        filled++;

        const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
        for (const n of neighbors) {
          if (Math.random() < 0.5) queue.push(n);
        }
      }
    }
  }

  function isWalkable(tile) {
    return tile.type !== TILE_TYPES.ROCK && tile.type !== TILE_TYPES.WATER;
  }

  function hasWalkablePath() {
    const visited = Array.from({ length: GRID_ROWS }, () => new Array(GRID_COLS).fill(false));
    const queue = [];

    for (let y = 0; y < GRID_ROWS; y++) {
      const tile = grid[y][SPAWN_COL];
      if (isWalkable(tile)) {
        queue.push([SPAWN_COL, y]);
        visited[y][SPAWN_COL] = true;
      }
    }

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (x === PLANTATION_COL) return true;

      const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
      for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) continue;
        if (visited[ny][nx]) continue;
        if (!isWalkable(grid[ny][nx])) continue;
        visited[ny][nx] = true;
        queue.push([nx, ny]);
      }
    }

    return false;
  }

  function forceOpenPath() {
    const midRow = Math.floor(GRID_ROWS / 2);
    for (let x = 0; x < GRID_COLS; x++) {
      const tile = grid[midRow][x];
      if (tile.type === TILE_TYPES.ROCK || tile.type === TILE_TYPES.WATER) {
        tile.type = TILE_TYPES.GRASS;
      }
    }
  }

  function applyHydration() {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const tile = grid[y][x];
        if (tile.type !== TILE_TYPES.WATER) continue;
        forEachNeighbor(x, y, (neighbor) => {
          neighbor.hydrated = true;
        });
      }
    }
  }

  function plow(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (tile.type !== TILE_TYPES.GRASS) return false;

    tile.type = TILE_TYPES.DIRT;
    dispatchTileChange(tile);
    return true;
  }

  function canPlacePlant(x, y, plantType) {
    const tile = getTile(x, y);
    if (!tile) return false;

    if (tile.type === TILE_TYPES.GRASS) return true;
    if (tile.type === TILE_TYPES.DIRT) return true;
    if (tile.type === TILE_TYPES.MUD) return plantType === 'vitoria_regia';
    return false;
  }

  function plantSeed(x, y, plantType) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (!canPlacePlant(x, y, plantType)) return false;

    if (tile.type === TILE_TYPES.GRASS) {
      tile.type = TILE_TYPES.DIRT;
    }

    if (tile.type === TILE_TYPES.DIRT) {
      tile.type = TILE_TYPES.SOIL;
    }

    tile.hasPlant = true;
    tile.plantType = plantType;
    tile.waterLevel = 0;

    dispatchTileChange(tile);
    return true;
  }

  function removePlant(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (!tile.hasPlant) return false;

    tile.hasPlant = false;
    tile.plantType = null;

    if (tile.type === TILE_TYPES.SOIL) {
      tile.type = TILE_TYPES.DIRT;
    }

    dispatchTileChange(tile);
    return true;
  }

  function canPlaceMachine(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    return tile.type === TILE_TYPES.DIRT ||
           tile.type === TILE_TYPES.SOIL ||
           tile.type === TILE_TYPES.MUD;
  }

  function placeMachine(x, y, machineType) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (!canPlaceMachine(x, y)) return false;
    if (tile.hasMachine) return false;

    tile.hasMachine = true;
    tile.machineType = machineType;

    dispatchTileChange(tile);
    return true;
  }

  function removeMachine(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (!tile.hasMachine) return false;

    tile.hasMachine = false;
    tile.machineType = null;

    dispatchTileChange(tile);
    return true;
  }

  function tryBreakRock(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (tile.type !== TILE_TYPES.ROCK) return false;

    let hasAdjacentMachine = false;
    forEachNeighbor(x, y, (neighbor) => {
      if (neighbor.hasMachine) hasAdjacentMachine = true;
    });

    if (!hasAdjacentMachine) return false;

    tile.type = TILE_TYPES.GRASS;
    dispatchTileChange(tile);
    return true;
  }

  function waterTile(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;

    tile.waterLevel++;

    if (tile.type === TILE_TYPES.SOIL && tile.waterLevel > MUD_WATER_EXCESS_THRESHOLD) {
      tile.type = TILE_TYPES.MUD;
      tile.hasPlant = false;
      tile.plantType = null;
      tile.waterLevel = 0;
      tile.dryTimer = 0;
    }

    dispatchTileChange(tile);
    return true;
  }

  function recordEnemyPass(x, y, nextX, nextY) {
    const tile = getTile(x, y);
    if (!tile) return;

    if (tile.type === TILE_TYPES.BUSH) {
      tile.type = TILE_TYPES.GRASS;
      dispatchTileChange(tile);
      return;
    }

    if (tile.type !== TILE_TYPES.GRASS && tile.type !== TILE_TYPES.DIRT) return;

    tile.trampleCount++;

    if (tile.type === TILE_TYPES.GRASS && tile.trampleCount >= TRAMPLE_TO_DIRT_THRESHOLD) {
      tile.type = TILE_TYPES.DIRT;
    }

    if (tile.trampleCount >= TRAMPLE_TO_TRAIL_THRESHOLD) {
      tile.type = TILE_TYPES.TRAIL;
      const dx = Math.sign(nextX - x);
      const dy = Math.sign(nextY - y);
      tile.trailDirection = DIRECTION_ARROWS[`${dx},${dy}`] || '→';
    }

    dispatchTileChange(tile);
  }

  function eatBush(x, y) {
    const tile = getTile(x, y);
    if (!tile) return false;
    if (tile.type !== TILE_TYPES.BUSH) return false;

    tile.type = TILE_TYPES.GRASS;
    dispatchTileChange(tile);
    return true;
  }

  function progressTerrain() {
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const tile = grid[y][x];
        tile.age++;

        if (tile.type === TILE_TYPES.BUSH) {
          tile.growthTimer++;
          if (tile.growthTimer >= BUSH_TO_GRASS_GROWTH_THRESHOLD) {
            tile.type = TILE_TYPES.GRASS;
            tile.growthTimer = 0;
            dispatchTileChange(tile);
          }
        }

        if (tile.type === TILE_TYPES.MUD) {
          tile.dryTimer++;
          if (tile.dryTimer >= MUD_TO_SOIL_DRY_THRESHOLD) {
            tile.type = tile.hasPlant ? TILE_TYPES.SOIL : TILE_TYPES.DIRT;
            tile.dryTimer = 0;
            dispatchTileChange(tile);
          }
        }
      }
    }

    applyHydration();

    window.dispatchEvent(new CustomEvent('terrain:progressed'));
  }

  function getSpawnTiles() {
    const tiles = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      const tile = grid[y][SPAWN_COL];
      if (isWalkable(tile)) tiles.push(tile);
    }
    return tiles;
  }

  function getPlantationTiles() {
    const tiles = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      tiles.push(grid[y][PLANTATION_COL]);
    }
    return tiles;
  }

  function checkPlantationReached(x, y) {
    if (x >= PLANTATION_COL) {
      window.dispatchEvent(new CustomEvent('terrain:gameOver', {
        detail: { x, y }
      }));
      return true;
    }
    return false;
  }

  function dispatchTileChange(tile) {
    window.dispatchEvent(new CustomEvent('terrain:tileChanged', {
      detail: { x: tile.x, y: tile.y, type: tile.type }
    }));
  }

  function getGrid() {
    return grid;
  }

  function getColor(type) {
    return TILE_COLORS[type] || '#000000';
  }

  window.addEventListener('game:start', () => {
    generate();
  });

  window.addEventListener('game:restart', () => {
    generate();
  });

  window.addEventListener('timer:waveStart', () => {
    if (grid.length > 0) progressTerrain();
  });

  return {
    GRID_COLS,
    GRID_ROWS,
    PLANTATION_COL,
    SPAWN_COL,
    TILE_TYPES,
    TILE_COLORS,
    generate,
    getGrid,
    getTile,
    getColor,
    isWalkable,
    hasWalkablePath,
    plow,
    canPlacePlant,
    plantSeed,
    removePlant,
    canPlaceMachine,
    placeMachine,
    removeMachine,
    tryBreakRock,
    waterTile,
    recordEnemyPass,
    eatBush,
    progressTerrain,
    getSpawnTiles,
    getPlantationTiles,
    checkPlantationReached
  };
})();