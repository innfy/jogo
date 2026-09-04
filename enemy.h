// EnemyManager.h
#pragma once
#include <string>
#include <vector>
#include <memory>
#include "MapManager.h"

enum class ParasiteType { PULGA, CARRAPATO, ACARO, BERNE };

struct EnemyData {
    std::string id;
    float hp;
    float speed;
    bool jumpsObstacles;
    bool eatsPath;
};

class EnemyInstance {
private:
    EnemyData data;
    float currentHp;
    float x;
    int y;
    std::vector<ParasiteType> parasites;

public:
    EnemyInstance(EnemyData data, int startY, std::vector<ParasiteType> parasites = {});
    void Move(float deltaTime);
    void TakeDamage(float amount);
    void RemoveParasite(ParasiteType type);
    bool IsDead() const;
    float GetX() const;
    int GetY() const;
    const EnemyData& GetData() const;
};

class WaveSpawner {
private:
    std::vector<std::unique_ptr<EnemyInstance>> activeEnemies;

public:
    void Spawn(EnemyData data, int row, std::vector<ParasiteType> parasites = {});
    void UpdateEnemies(float deltaTime, MapManager& map);
};