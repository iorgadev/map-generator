import React from "react";
import { GlobeIcon, CogIcon } from "@heroicons/react/outline";

function Settings({
  setMapSettings,
  mapSettings,
  setNoiseSettings,
  noiseSettings,
  generateNewMap,
}) {
  return (
    <div className="settings">
      <div className="flex items-center justify-center p-2 mb-3 space-x-2 text-2xl font-bold text-white border-b-4 border-green-900 border-opacity-25">
        <CogIcon className="w-16 h-16 text-amber-400" />
        <div className="flex flex-col space-y-2 transform translate-y-2">
          <span className="text-6xl leading-[1rem] text-green-100">Map</span>
          <span>Generator</span>
        </div>
      </div>
      <label>
        Size (x,y):
        <input
          type="number"
          value={mapSettings.width}
          onChange={(e) =>
            setMapSettings((prev) => ({
              ...prev,
              width: e.target.value,
              height: e.target.value,
            }))
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
          onWheel={(e) => {
            if (e.deltaY > 0) {
              setNoiseSettings((prev) => ({
                ...prev,
                octaves: prev.octaves + 1,
              }));
            } else {
              setNoiseSettings((prev) => ({
                ...prev,
                octaves: prev.octaves - 1,
              }));
            }
          }}
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
                persistence:
                  Math.round((prev.persistence + 0.01 + Number.EPSILON) * 100) /
                  100,
              }));
            } else {
              setNoiseSettings((prev) => ({
                ...prev,
                persistence:
                  Math.round((prev.persistence - 0.01 + Number.EPSILON) * 100) /
                  100,
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
      <div className="flex items-center justify-center w-full pt-10">
        <button
          onClick={generateNewMap}
          className="flex items-center justify-center p-2 space-x-1 text-2xl uppercase bg-blue-500 border-4 border-blue-800 text-blue-50 hover:bg-blue-600"
        >
          <GlobeIcon className="w-6 h-6 text-white" />
          <span>Generate Map</span>
        </button>
      </div>
    </div>
  );
}

export default Settings;
