// EnemyManager.cpp
#include "EnemyManager.h"
#include <algorithm>

EnemyInstance::EnemyInstance(EnemyData pData, int startY, std::vector<ParasiteType> pParasites)
    : data(pData), currentHp(pData.hp), x(0.0f), y(startY), parasites(pParasites) {}

void EnemyInstance::Move(float deltaTime) {
    x += data.speed * deltaTime;
}

void EnemyInstance::TakeDamage(float amount) {
    currentHp -= amount;
}

void EnemyInstance::RemoveParasite(ParasiteType type) {
    auto it = std::find(parasites.begin(), parasites.end(), type);
    if (it != parasites.end()) {
        parasites.erase(it);
        if (parasites.empty() && (data.id == "rato" || data.id == "javali" || data.id == "javalao")) {
            currentHp = 0;
        }
    }
}

bool EnemyInstance::IsDead() const {
    return currentHp <= 0;
}

float EnemyInstance::GetX() const { return x; }
int EnemyInstance::GetY() const { return y; }
const EnemyData& EnemyInstance::GetData() const { return data; }

void WaveSpawner::Spawn(EnemyData data, int row, std::vector<ParasiteType> parasites) {
    activeEnemies.push_back(std::make_unique<EnemyInstance>(data, row, parasites));
}

void WaveSpawner::UpdateEnemies(float deltaTime, MapManager& map) {
    for (auto it = activeEnemies.begin(); it != activeEnemies.end(); ) {
        (*it)->Move(deltaTime);
        
        int gridX = static_cast<int>((*it)->GetX());
        
        if (map.IsPlantation(gridX)) {
            // Lógica de Game Over
        } else {
            TileType currentTile = map.GetTileType(gridX, (*it)->GetY());
            
            if (currentTile == TileType::GRAMA) {
                map.ChangeTileType(gridX, (*it)->GetY(), TileType::TRILHA);
            }
            
            if ((*it)->GetData().eatsPath && currentTile == TileType::MATO) {
                map.ChangeTileType(gridX, (*it)->GetY(), TileType::TERRA);
            }
        }

        if ((*it)->IsDead()) {
            it = activeEnemies.erase(it);
        } else {
            ++it;
        }
    }
}