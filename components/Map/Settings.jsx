import React from "react";

function Settings({
  setMapSettings,
  mapSettings,
  setNoiseSettings,
  noiseSettings,
}) {
  return (
    <div className="settings">
      <span className="block mb-3 text-xl font-bold text-neutral-200">
        Map Settings:
      </span>
      <label>
        Width:
        <input
          type="number"
          value={mapSettings.width}
          onChange={(e) =>
            setMapSettings((prev) => ({ ...prev, width: e.target.value }))
          }
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={mapSettings.height}
          onChange={(e) =>
            setMapSettings((prev) => ({ ...prev, height: e.target.value }))
          }
        />
      </label>
      <label>
        Tile Size:
        <input
          type="number"
          value={mapSettings.tileSize}
          onChange={(e) =>
            setMapSettings((prev) => ({ ...prev, tileSize: e.target.value }))
          }
        />
      </label>
      <label>
        Octaves:
        <input
          type="number"
          value={noiseSettings.octaves}
          onChange={(e) =>
            setNoiseSettings((prev) => ({
              ...prev,
              octaves: e.target.value,
            }))
          }
        />
      </label>
      <label>
        Amplitude:
        <input
          type="number"
          value={noiseSettings.amplitude}
          onChange={(e) =>
            setNoiseSettings((prev) => ({
              ...prev,
              amplitude: e.target.value,
            }))
          }
          onWheel={(e) => {
            if (e.deltaY > 0) {
              setNoiseSettings((prev) => ({
                ...prev,
                amplitude:
                  Math.round((prev.amplitude + 0.01 + Number.EPSILON) * 100) /
                  100,
              }));
            } else {
              setNoiseSettings((prev) => ({
                ...prev,
                amplitude:
                  Math.round((prev.amplitude - 0.01 + Number.EPSILON) * 100) /
                  100,
              }));
            }
          }}
        />
      </label>
      {/* <label>
        Lacunarity:
        <input
          type="number"
          value={noiseSettings.lacunarity}
          onChange={(e) =>
            setNoiseSettings((prev) => ({
              ...prev,
              lacunarity: e.target.value,
            }))
          }
        />
      </label> */}
      <label>
        Persistence:
        <input
          type="number"
          value={noiseSettings.persistence}
          onChange={(e) =>
            setNoiseSettings((prev) => ({
              ...prev,
              persistence: e.target.value,
            }))
          }
          onWheel={(e) => {
            if (e.deltaY > 0) {
              setNoiseSettings((prev) => ({
                ...prev,
                persistence: prev.persistence + 0.01,
              }));
            } else {
              setNoiseSettings((prev) => ({
                ...prev,
                persistence: prev.persistence - 0.01,
              }));
            }
          }}
        />
      </label>
      {/* <label>
        Seed:
        <input
          type="number"
          value={noiseSettings.seed}
          onChange={(e) =>
            setNoiseSettings((prev) => ({
              ...prev,
              seed: e.target.value,
            }))
          }
        />
      </label> */}
    </div>
  );
}

export default Settings;
