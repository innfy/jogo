// MapManager.cpp (Lógica correspondente em C++)
#include "MapManager.h"
#include <cstdlib>
#include <ctime>

MapManager::MapManager() {
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
}

void MapManager::GenerateNewMap() {
    grid.clear();
    grid.resize(ROWS, std::vector<Tile>(COLUMNS));

    for (int y = 0; y < ROWS; y++) {
        for (int x = 0; x < COLUMNS; x++) {
            TileType type = TileType::GRAMA;

            if (x < COLUMNS - 1) {
                int chance = std::rand() % 100;
                if (chance < 5) {
                    type = TileType::PEDRA;
                } else if (chance < 10) {
                    type = TileType::AGUA;
                } else if (chance < 15) {
                    type = TileType::MATO;
                }
            }

            grid[y][x] = { x, y, type, x == COLUMNS - 1 };
        }
    }
}

void MapManager::ChangeTileType(int x, int y, TileType newType) {
    if (x >= 0 && x < COLUMNS && y >= 0 && y < ROWS) {
        grid[y][x].type = newType;
    }
}

TileType MapManager::GetTileType(int x, int y) const {
    if (x >= 0 && x < COLUMNS && y >= 0 && y < ROWS) {
        return grid[y][x].type;
    }
    return TileType::PEDRA; // Se sair do mapa, considera como bloqueado
}

bool MapManager::IsPlantation(int x) const {
    return x == COLUMNS - 1;
}