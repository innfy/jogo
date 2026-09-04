// CardManager.h (Lógica correspondente em C++)
#pragma once
#include <string>
#include <vector>

struct CardData {
    std::string id;
    int currentAmount;
    int maxLimit;
};

class CardManager {
private:
    std::vector<CardData> plantCards;
    std::vector<CardData> machineCards;
    float timeToReplenish = 15.0f;
    float replenishTimer = 0.0f;

    void ReplenishCards(int currentWave);

public:
    CardManager();
    bool TryUseCard(CardData* card);
    void Update(float deltaTime, int currentWave);
    
    std::vector<CardData>& GetPlantCards();
    std::vector<CardData>& GetMachineCards();
};