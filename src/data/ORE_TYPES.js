import node_iron_png from "../assets/ores/NODE_IRON.png";
import node_gold_png from "../assets/ores/NODE_GOLD.png";

const ORE_TYPES = {
    IRON: {
        type: "IRON",
        name: "Iron ore",
        png: node_iron_png,
        completetime: 4000,
        lifespan: 15,
        yield: 1,
        color: "#80778E",
        owned: 0
      },
    GOLD: {
        type: "GOLD",
        name: "Iron ore",
        png: node_gold_png,
        completetime: 6000,
        lifespan: 15,
        yield: 1,
        color: "#80778E",
        owned: 0
      },


}

export default ORE_TYPES;

const initialNodes = [
    {
      name: "Iron ore",
      png: node_iron_png,
      completetime: 6 * 1000,
      lifespan: 100,
      yield: 1,
      workers: 1,
      remaining: 100,
      progress: 0,
      last_tick: performance.now(),
      isVisible: true
    },
    {
      name: "Iron ore",
      png: node_iron_png,
      completetime: 8 * 1000,
      lifespan: 100,
      yield: 1,
      workers: 1,
      remaining: 100,
      progress: 0,
      last_tick: performance.now(),
      isVisible: true
    },
    {
      name: "Iron ore",
      png: node_iron_png,
      completetime: 8 * 1000,
      lifespan: 100,
      yield: 1,
      workers: 1,
      remaining: 100,
      progress: 0,
      last_tick: performance.now(),
      isVisible: true
    }
  ];