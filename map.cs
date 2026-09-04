// MapManager.cs (Lógica correspondente em C#)
using System;

public enum TileType 
{
    Grama, Terra, Solo, Lama, Trilha, Pedra, Agua, Mato
}

public class Tile 
{
    public int X { get; private set; }
    public int Y { get; private set; }
    public TileType Type { get; set; }
    public bool IsPlantationZone => X == MapManager.COLUMNS - 1;

    public Tile(int x, int y, TileType type) 
    {
        X = x;
        Y = y;
        Type = type;
    }
}

public class MapManager 
{
    public const int COLUMNS = 20;
    public const int ROWS = 10;
    
    public Tile[,] Grid { get; private set; }
    private Random _random;

    public MapManager() 
    {
        _random = new Random();
    }

    public void GenerateNewMap() 
    {
        Grid = new Tile[COLUMNS, ROWS];

        for (int y = 0; y < ROWS; y++) 
        {
            for (int x = 0; x < COLUMNS; x++) 
            {
                TileType type = TileType.Grama;

                if (x < COLUMNS - 1) 
                {
                    double chance = _random.NextDouble();
                    if (chance < 0.05) type = TileType.Pedra;
                    else if (chance < 0.10) type = TileType.Agua;
                    else if (chance < 0.15) type = TileType.Mato;
                }

                Grid[x, y] = new Tile(x, y, type);
            }
        }
    }

    public void ChangeTileType(int x, int y, TileType newType) 
    {
        if (x >= 0 && x < COLUMNS && y >= 0 && y < ROWS) 
        {
            Grid[x, y].Type = newType;
        }
    }
}