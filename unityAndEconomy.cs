// UnitsAndEconomy.cs (Lógica correspondente em C#)
using System.Collections.Generic;

public class EconomyManager 
{
    public int Money { get; private set; } = 150;

    public bool SpendMoney(int amount) 
    {
        if (Money >= amount) 
        {
            Money -= amount;
            return true;
        }
        return false;
    }

    public void AddMoney(int amount) => Money += amount;
}

public class PlantData 
{
    public string Name { get; set; }
    public float GrowthTime { get; set; }
    public int RewardValue { get; set; }
}

public class MachineData 
{
    public string Name { get; set; }
    public int Cost { get; set; }
    public string AreaType { get; set; }
}

public class PlantInstance 
{
    public PlantData Data { get; private set; }
    public float CurrentGrowthTime { get; private set; }
    public bool IsReadyToHarvest => CurrentGrowthTime <= 0;

    public PlantInstance(PlantData data) 
    {
        Data = data;
        CurrentGrowthTime = data.GrowthTime;
    }

    public void Update(float deltaTime) 
    {
        if (CurrentGrowthTime > 0)
            CurrentGrowthTime -= deltaTime;
    }

    public int Harvest() 
    {
        if (IsReadyToHarvest) return Data.RewardValue;
        return 0;
    }
}

public class MachineInstance 
{
    public MachineData Data { get; private set; }
    
    public MachineInstance(MachineData data) 
    {
        Data = data;
    }
    
    // Métodos para disparo de gás e habilidades específicos seriam implementados aqui
}