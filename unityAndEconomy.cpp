// UnitsAndEconomy.cpp (Lógica correspondente em C++)
#include "UnitsAndEconomy.h"

bool EconomyManager::SpendMoney(int amount) {
    if (money >= amount) {
        money -= amount;
        return true;
    }
    return false;
}

void EconomyManager::AddMoney(int amount) {
    money += amount;
}

int EconomyManager::GetMoney() const {
    return money;
}

PlantInstance::PlantInstance(PlantData pData) : data(pData), currentGrowthTime(pData.growthTime), isReady(false) {}

void PlantInstance::Update(float deltaTime) {
    if (!isReady) {
        currentGrowthTime -= deltaTime;
        if (currentGrowthTime <= 0.0f) {
            isReady = true;
        }
    }
}

bool PlantInstance::IsReadyToHarvest() const {
    return isReady;
}

int PlantInstance::Harvest() {
    if (isReady) {
        return data.rewardValue;
    }
    return 0;
}

MachineInstance::MachineInstance(MachineData mData) : data(mData) {}

void MachineInstance::Attack() {
    // Implementação dos gases de defesa baseada na área (3x3, 6x6, etc)
}