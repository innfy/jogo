// UnitsAndEconomy.h (Lógica correspondente em C++)
#pragma once
#include <string>
#include <vector>
#include <memory>

class EconomyManager {
private:
    int money = 150;
public:
    bool SpendMoney(int amount);
    void AddMoney(int amount);
    int GetMoney() const;
};

struct PlantData {
    std::string name;
    float growthTime;
    int rewardValue;
};

struct MachineData {
    std::string name;
    int cost;
    std::string areaType;
};

class PlantInstance {
private:
    PlantData data;
    float currentGrowthTime;
    bool isReady;

public:
    PlantInstance(PlantData data);
    void Update(float deltaTime);
    bool IsReadyToHarvest() const;
    int Harvest();
};

class MachineInstance {
private:
    MachineData data;
public:
    MachineInstance(MachineData data);
    void Attack(); // Lógica de área específica (3x3, 6x0, etc)
};