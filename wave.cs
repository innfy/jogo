// WaveManager.cs (Lógica correspondente em C#)
using System;

public class WaveManager 
{
    public int MaxWaves { get; private set; } = 5;
    public int TurnTimeSeconds { get; private set; } = 30;
    
    public int CurrentWave { get; private set; } = 1;
    public bool IsDayTime { get; private set; } = true;
    public float TimeRemaining { get; private set; }
    
    public bool IsGameRunning { get; private set; } = false;

    public void StartGame() 
    {
        CurrentWave = 1;
        IsDayTime = true;
        TimeRemaining = TurnTimeSeconds;
        IsGameRunning = true;
    }

    public void Update(float deltaTime) 
    {
        if (!IsGameRunning) return;

        TimeRemaining -= deltaTime;

        if (TimeRemaining <= 0) 
        {
            NextTurn();
        }
    }

    private void NextTurn() 
    {
        if (IsDayTime) 
        {
            IsDayTime = false;
        } 
        else 
        {
            IsDayTime = true;
            CurrentWave++;
        }

        if (CurrentWave > MaxWaves) 
        {
            IsGameRunning = false;
            // Lógica futura de vitória
            return;
        }

        TimeRemaining = TurnTimeSeconds;
    }

    public void Pause() => IsGameRunning = false;
    public void Resume() => IsGameRunning = true;
}