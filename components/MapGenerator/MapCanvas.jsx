import { useRef, useEffect, useState } from "react";

import { getTileType, getTile } from "../MapGenerator";

export default function MapCanvas({ map, mapSettings, options }) {
  const canvasRef = useRef(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [offsetPos, setOffsetPos] = useState({ x: 0, y: 0 });
  const [panningPos, setPanningPos] = useState({ x: 550, y: 50 });
  const [scale, setScale] = useState(options.scale);

  const scaledValueToInt = (value) =>
    parseInt(Math.ceil(value * 1000000)) / 1000000;

  // function to take the tile size and scale and return an integer value between 1 and tileSize
  const getScaledTileSize = () => {
    return Math.ceil(mapSettings.tileSize * scale);
  };

  const getXYFromIndex = (index) => {
    const tilesetWidth = 7;
    const tilesetHeight = 42;
    return {
      x: index % tilesetWidth,
      y: Math.floor(index / tilesetWidth),
    };
  };

  //draw the map on the canvas for each tile in the map variable
  function drawMap(panX = 0, panY = 0) {
    const tileAtlas = new Image();
    tileAtlas.src = `/images/tileset.png`;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //fill the canvas with a pink color
    const scaledTileSize = getScaledTileSize();
    map.forEach((row, y) => {
      row.forEach((tile, x) => {
        // use scale variable to scale the tiles
        // if (tile.index === -1) {
        ctx.fillStyle = tile.color;
        ctx.fillRect(
          x * scaledTileSize + panningPos.x,
          y * scaledTileSize + panningPos.y,
          scaledTileSize,
          scaledTileSize
        );
        // } else {
        //   // use the tile atlas to draw the tiles
        //   // if (tile.index === 6) {
        //   if (tile.layer && tile.layer.length > 0) {
        //     tile.layer.forEach((layer, index) => {
        //       // console.log(tile);
        //       ctx.drawImage(
        //         tileAtlas,
        //         getXYFromIndex(getTileType(layer.type).index).x * 16,
        //         getXYFromIndex(getTileType(layer.type).index).y * 16,
        //         15,
        //         15,
        //         x * scaledTileSize + panningPos.x,
        //         y * scaledTileSize + panningPos.y,
        //         scaledTileSize,
        //         scaledTileSize
        //       );
        //     });
        //   }

        //   ctx.drawImage(
        //     tileAtlas,
        //     getXYFromIndex(tile.index).x * 16,
        //     getXYFromIndex(tile.index).y * 16,
        //     15,
        //     15,
        //     x * scaledTileSize + panningPos.x,
        //     y * scaledTileSize + panningPos.y,
        //     scaledTileSize,
        //     scaledTileSize
        //   );
        // }

        // ctx.drawImage(
        //   tileAtlas, // image
        //   x * scaledTileSize + panningPos.x, // source x
        //   0, // source y
        //   16, // source width
        //   16, // source height
        //   x * scaledTileSize, // target x
        //   y * scaledTileSize, // target y
        //   scaledTileSize, // target width
        //   scaledTileSize // target height
        // );
        // ctx.fillRect(x * 32 + panX, y * 32 + panY, 32, 32);
      });
    });
    // drawMap();
  }

  useEffect(() => {
    drawMap();
  }, [map, scale]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get the x and y position as if the canvas was based a 32x32 tile grid
    // starting at the top left corner where the first tile is at (0,0)
    const x = e.clientX - canvasRef.current.offsetLeft;
    const y = e.clientY - canvasRef.current.offsetTop;
    console.log(x, y);
    console.log("Scale: ", scale);
    console.log("Tile Size: ", getScaledTileSize());

    setMousePos((pos) => ({
      x: parseInt(e.clientX - offsetPos.x),
      y: parseInt(e.clientY - offsetPos.y),
    }));
    setStartPos((prev) => ({
      x: parseInt(e.clientX - offsetPos.x),
      y: parseInt(e.clientY - offsetPos.y),
    }));
    setIsDragging(true);
  };

  const reset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    var BB = canvas.getBoundingClientRect();
    setOffsetPos((prev) => ({
      x: BB.left,
      y: BB.top,
    }));
  };

  useEffect(() => {
    drawMap();
  }, [mousePos, startPos, offsetPos, panningPos]);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    var distanceX = mousePos.x - startPos.x;
    var distanceY = mousePos.y - startPos.y;
    var panX = panningPos.x + distanceX;
    var panY = panningPos.y + distanceY;

    setMousePos((pos) => ({
      x: parseInt(e.clientX - offsetPos.x),
      y: parseInt(e.clientY - offsetPos.y),
    }));

    setStartPos((pos) => ({ x: mousePos.x, y: mousePos.y }));
    setPanningPos((pos) => ({ x: panX, y: panY }));

    // drawMap(panX, panY);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging((prev) => false);
  };

  const handleMouseOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging((prev) => false);
  };

  return (
    <canvas
      id="map-canvas"
      ref={canvasRef}
      width={options.width}
      height={options.height}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseOut={(e) => handleMouseOut(e)}
      onWheel={(e) => {
        // e.preventDefault();
        // e.stopPropagation();
        //if scrolling up, zoom out of the canvas
        if (e.deltaY > 0) {
          setScale((prev) => prev - 0.03333);
          // console.log("zoom out");
        }
        //if scrolling down, zoom in on the canvas
        if (e.deltaY < 0) {
          setScale((prev) => prev + 0.03333);
        }
      }}
    />
  );
}
