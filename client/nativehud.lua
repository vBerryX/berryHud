-- Entfernt das Standard GTA Leben, Rüstung und Geld von der Minimap/dem HUD
Citizen.CreateThread(function()
    local minimap = RequestScaleformMovie("minimap")

    while not HasScaleformMovieLoaded(minimap) do
        Citizen.Wait(0)
    end

    -- Wir zwingen die Karte hier einmalig auf Normalgröße!
    SetRadarBigmapEnabled(false, false)

    while true do
        Citizen.Wait(0)

        -- Versteckt Leben und Rüstung von der GTA Map (3 = Unsichtbar)
        -- Muss laut GTA-Engine jeden Frame neu gesetzt werden, daher hier bewusst kein Diffing.
        BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
        ScaleformMovieMethodAddParamInt(3)
        EndScaleformMovieMethod()

        -- Verstecke weitere störende GTA-Elemente
        HideHudComponentThisFrame(1)  -- Fahndungssterne
        HideHudComponentThisFrame(3)  -- GTA Geld
        HideHudComponentThisFrame(4)  -- GTA MP Geld
        HideHudComponentThisFrame(7)  -- Gebietsname
        HideHudComponentThisFrame(9)  -- Straßenname
        HideHudComponentThisFrame(13) -- Geld-Änderung
    end
end)
