// EnemySystem.cs (C#)
using System;
using System.Collections.Generic;

public enum ParasiteType { Pulga, Carrapato, Acaro, Berne }

public class EnemyData 
{
    public string Id { get; set; }
    public float MaxHp { get; set; }
    public float Speed { get; set; }
    public bool JumpsOverObstacles { get; set; }
    public bool EatsPath { get; set; }
}

public class EnemyInstance 
{
    public EnemyData Data { get; private set; }
    public float CurrentHp { get; private set; }
    public float X { get; set; }
    public float Y { get; set; }
    
    public List<ParasiteType> Parasites { get; private set; } = new List<ParasiteType>();

    public EnemyInstance(EnemyData data, int startY) 
    {
        Data = data;
        CurrentHp = data.MaxHp;
        X = 0;
        Y = startY;
        
        GenerateParasites();
    }

    private void GenerateParasites() 
    {
        if (Data.Id == "rato" || Data.Id == "javali" || Data.Id == "javalao") 
        {
            Random rnd = new Random();
            int count = Data.Id == "javalao" ? 8 : rnd.Next(1, 4);
            for (int i = 0; i < count; i++) 
            {
                Parasites.Add((ParasiteType)rnd.Next(0, 4));
            }
        }
    }

    public void Move(float deltaTime) 
    {
        if (Data.Speed > 0) 
        {
            X += Data.Speed * deltaTime;
            // A lógica de seguir a Trilha (mudar Y) será implementada no Pathfinding
        }
    }
}

public class WaveController 
{
    public void UpdateSpawns(int currentWave, float deltaTime) 
    {
        // Lógica de temporização de spawn baseada na wave (1 a 5)
    }
}