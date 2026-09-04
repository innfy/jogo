// CardManager.cs (Lógica de repetição e limites em C#)
using System;
using System.Collections.Generic;

public abstract class CardData 
{
    public string Id { get; set; }
    public int CurrentAmount { get; set; }
    public int MaxLimit { get; set; }
}

public class CardManager 
{
    public List<CardData> PlantCards { get; private set; }
    public List<CardData> MachineCards { get; private set; }
    
    private float _timeToReplenish = 15f;
    private float _replenishTimer = 0f;
    private Random _random = new Random();

    public CardManager() 
    {
        PlantCards = new List<CardData>();
        MachineCards = new List<CardData>();
        // Inicialização com dados base seria feita aqui
    }

    public bool TryUseCard(CardData card) 
    {
        if (card.CurrentAmount > 0) 
        {
            card.CurrentAmount--;
            return true;
        }
        return false;
    }

    public void Update(float deltaTime, int currentWave) 
    {
        _replenishTimer += deltaTime;
        
        if (_replenishTimer >= _timeToReplenish) 
        {
            _replenishTimer = 0f;
            ReplenishCards(currentWave);
        }
    }

    private void ReplenishCards(int currentWave) 
    {
        var availablePlants = PlantCards.FindAll(p => p.CurrentAmount < p.MaxLimit);
        if (availablePlants.Count > 0) 
        {
            var p = availablePlants[_random.Next(availablePlants.Count)];
            p.CurrentAmount++;
            if (currentWave > 2) p.MaxLimit++;
        }

        var availableMachines = MachineCards.FindAll(m => m.CurrentAmount < m.MaxLimit);
        if (availableMachines.Count > 0) 
        {
            var m = availableMachines[_random.Next(availableMachines.Count)];
            m.CurrentAmount++;
            if (currentWave > 3) m.MaxLimit++;
        }
    }
}