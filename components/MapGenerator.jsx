import { useState, useEffect } from "react";
import perlin from "perlin-noise";
import Settings from "@/components/Map/Settings";
import MapCanvas from "./MapGenerator/MapCanvas";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export const tileTypes = [
  {
    type: "deep",
    color: "#002470",
    index: -1,
  },
  {
    type: "water",
    color: "#0064c8",
    index: -1,
  },
  {
    type: "shallow",
    color: "#4ea6ff",
    index: -1,
  },
  {
    type: "sand",
    color: "#f0e68c",
    index: 1,
  },
  {
    type: "dirt",
    color: "#00a300",
    index: 0,
  },
  {
    type: "grass",
    color: "#00a300",
    index: 2,
  },
  {
    type: "trees",
    color: "#007c00",
    layer: [
      {
        type: "grass",
      },
    ],
    index: 5,
  },
  {
    type: "hills",
    // color: "#006800",
    color: "#605050",
    layer: [
      {
        type: "grass",
      },
    ],
    index: 10,
  },
  {
    type: "mountain",
    color: "#505050",
    layer: [
      {
        type: "grass",
      },
    ],
    index: 11,
  },
  {
    type: "snow",
    color: "#3f3f3f",
    layer: [
      {
        type: "grass",
      },
    ],
    index: 12,
  },
];
export const getTile = (value) => {
  // using a value between 0 and 1, return a tile type
  return tileTypes[Math.floor(value * 10)]
    ? tileTypes[Math.floor(value * 10)]
    : tileTypes[0];
};

// get a tile based on the type of tile
export const getTileType = (type) => {
  return tileTypes.find((tile) => tile.type === type);
};

function MiniRPG() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }
  const [windowSize, setWindowSize] = useState(getWindowDimensions());
  const [mapSettings, setMapSettings] = useState({
    width: 200,
    height: 200,
    tileSize: 32,
    tileSet: "default",
  });
  const [map, setMap] = useState();
  const [noiseSettings, setNoiseSettings] = useState({
    octaves: 4,
    amplitude: 0.2,
    persistence: 0.1,
    // frequency: 1,
    // lacunarity: 2,
    // seed: Math.random(),
  });
  const [canvasOptions, setCanvasOptions] = useState({
    width: windowSize.width,
    height: windowSize.height,
    scale: 0.25,
  });

  // get a index from a 2d array
  const getIndex = (y, x) => {
    return y * mapSettings.height + x;
  };

  function createMap(noise, width, height) {
    // create a falloff map
    const fallOffMap = () => {
      const map = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // AAAAAAAAAAAAAAAAAAAAAAA
          // const value =
          //   1 -
          //   Math.abs(
          //     (x - width / 2) / (width / 2) + (y - height / 2) / (height / 2)
          //   );
          // map.push(value);

          //BBBBBBBBBBBBBBBBBBBBBBBBBBBB
          // falloff evaluation function
          // const a = 3;
          // const b = 2.2;

          // const value = 1 - Math.pow((a * (x - width / 2)) / (width / 2), b);
          // map.push(value);

          //CCCCCCCCCCCCCCCCCCCCCCC
          const fX = (x / width) * 2 - 1;
          const fY = (y / height) * 2 - 1;

          const value = Math.max(Math.abs(fX), Math.abs(fY));
          const a = 3;
          const b = 2.2;

          // value = 1 - Math.pow((a * value) / (width / 2), b);
          value =
            Math.pow(value, a) /
            (Math.pow(value, a) + Math.pow(b - b * value, a));
          map.push(value);
        }
      }
      return map;
    };

    const fallOffNoise = fallOffMap();

    let grid = [];
    for (let x = 0; x < width; x++) {
      let row = [];
      for (let y = 0; y < height; y++) {
        const noiseLevel = clamp(
          noise[getIndex(y, x)] - fallOffNoise[getIndex(y, x)],
          0,
          1
        );
        let tileSettings = getTile(noiseLevel);
        let tile = {
          type: tileSettings.type,
          color: tileSettings.color,
          index: tileSettings.index,
          layer: tileSettings.layer,
          x: x,
          y: y,
        };
        row.push(tile);
      }
      grid.push(row);
    }
    return grid;
  }

  useEffect(() => {
    const noise = perlin.generatePerlinNoise(
      mapSettings.width,
      mapSettings.height,
      {
        octaveCount: noiseSettings.octaves,
        amplitude: noiseSettings.amplitude,
        persistence: noiseSettings.persistence,
      }
    );
    setMap((prev) => createMap(noise, mapSettings.width, mapSettings.height));
  }, [mapSettings, noiseSettings]);

  useEffect(() => {
    setCanvasOptions({
      width: windowSize.width,
      height: windowSize.height,
      scale: 0.25,
    });
  }, [windowSize]);

  const updateDimensions = () => {
    console.log("updateDimensions: ", windowSize);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (!map) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen">
      <Settings
        setMapSettings={setMapSettings}
        mapSettings={mapSettings}
        noiseSettings={noiseSettings}
        setNoiseSettings={setNoiseSettings}
      />
      <MapCanvas map={map} mapSettings={mapSettings} options={canvasOptions} />
    </div>
  );
}

export default MiniRPG;
