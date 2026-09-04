// EnemyManager.cs
using System.Collections.Generic;
using System.Linq;

public enum ParasiteType { Pulga, Carrapato, Acaro, Berne }

public class EnemyData 
{
    public string Id { get; set; }
    public float Hp { get; set; }
    public float Speed { get; set; }
    public bool JumpsObstacles { get; set; }
    public bool EatsPath { get; set; }
}

public class EnemyInstance 
{
    public EnemyData Data { get; private set; }
    public float CurrentHp { get; set; }
    public float X { get; set; }
    public int Y { get; set; }
    public List<ParasiteType> Parasites { get; private set; }

    public EnemyInstance(EnemyData data, int startY, List<ParasiteType> parasites = null) 
    {
        Data = data;
        CurrentHp = data.Hp;
        X = 0;
        Y = startY;
        Parasites = parasites ?? new List<ParasiteType>();
    }

    public void Move(float deltaTime) 
    {
        X += Data.Speed * deltaTime;
    }

    public void TakeDamage(float amount, ParasiteType? targetedParasite = null) 
    {
        if (targetedParasite.HasValue && Parasites.Contains(targetedParasite.Value)) 
        {
            Parasites.Remove(targetedParasite.Value);
            if (Parasites.Count == 0 && (Data.Id == "rato" || Data.Id == "javali" || Data.Id == "javalao")) 
            {
                CurrentHp = 0; // Derrotado se perder todos os parasitas
            }
        } 
        else if (!targetedParasite.HasValue) 
        {
            CurrentHp -= amount;
        }
    }

    public bool IsDead => CurrentHp <= 0;
}

public class WaveSpawner 
{
    private List<EnemyInstance> _activeEnemies = new List<EnemyInstance>();

    public void Spawn(EnemyData data, int row, List<ParasiteType> parasites = null) 
    {
        _activeEnemies.Add(new EnemyInstance(data, row, parasites));
    }

    public void UpdateEnemies(float deltaTime, MapManager map) 
    {
        for (int i = _activeEnemies.Count - 1; i >= 0; i--) 
        {
            var enemy = _activeEnemies[i];
            enemy.Move(deltaTime);

            int gridX = (int)enemy.X;
            if (map.IsPlantation(gridX)) 
            {
                // Disparar Evento Game Over
            }
            else if (gridX < MapManager.COLUMNS)
            {
                TileType currentTile = map.Grid[gridX, enemy.Y].Type;
                if (currentTile == TileType.Grama) 
                {
                    map.ChangeTileType(gridX, enemy.Y, TileType.Trilha);
                }
                
                if (enemy.Data.EatsPath && currentTile == TileType.Mato) 
                {
                    map.ChangeTileType(gridX, enemy.Y, TileType.Terra);
                }
            }

            if (enemy.IsDead) 
            {
                _activeEnemies.RemoveAt(i);
            }
        }
    }
}