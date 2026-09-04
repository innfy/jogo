// MapManager.h (Lógica correspondente em C++)
#pragma once
#include <vector>

enum class TileType {
    GRAMA, TERRA, SOLO, LAMA, TRILHA, PEDRA, AGUA, MATO
};

struct Tile {
    int x;
    int y;
    TileType type;
    bool isPlantationZone;
};

class MapManager {
private:
    static const int COLUMNS = 20;
    static const int ROWS = 10;
    std::vector<std::vector<Tile>> grid;

public:
    MapManager();
    void GenerateNewMap();
    void ChangeTileType(int x, int y, TileType newType);
    TileType GetTileType(int x, int y) const;
    bool IsPlantation(int x) const;
};