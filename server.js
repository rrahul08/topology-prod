const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 4000;
const uri = "mongodb+srv://topoadmin:topoadmin@source.wsqjwh6.mongodb.net/?retryWrites=true&w=majority&appName=source";

app.use(cors());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: true, message: 'Internal Server Error' });
});

const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log(new Date(), "Connected to MongoDB server");
    app.locals.dbClient = client;
  })
  .catch((err) => {
    console.error('An error occurred connecting to the database', err);
  });

// Get all 'isis-database-entry' data formatted
app.get('/isis_database', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const formattedData = allData.flatMap(doc =>
      doc["isis-database-information"].flatMap(info =>
        info["isis-database"].flatMap(entry =>
          entry["isis-database-entry"] ? entry["isis-database-entry"].map(dataEntry => ({
            "lsp-id": dataEntry["lsp-id"][0]["data"],
            "isis-neighbor": dataEntry["isis-neighbor"].map(neighbor => ({
              "is-neighbor-id": neighbor["is-neighbor-id"][0]["data"],
              "metric": neighbor["metric"][0]["data"]
            }))
          })) : []
        )
      )
    );
    res.json(formattedData);
  } catch (error) {
    next(error);
  }
});

app.get('/network_graph_data', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();
    allData.flatMap(doc =>
      doc["isis-database-information"].flatMap(info =>
        info["isis-database"].flatMap(entry =>
          entry["isis-database-entry"] && entry["isis-database-entry"].forEach(dataEntry => {
            const lspId = String(dataEntry["lsp-id"][0]["data"]);
              nodes.set(lspId, { id: lspId, position: { x: 0, y: 0 }, data: { value: lspId } });
                 dataEntry["isis-neighbor"].forEach(neighbor => {
              const neighborId = String(neighbor["is-neighbor-id"][0]["data"]);
              const edgeId = `${lspId}->${neighborId}`;
              edges.add({ id: edgeId, source: nodes.get(lspId).data.value, target: nodes.get(neighborId)?.data?.value || neighborId });
            });
          })
        )
      )
    );
    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});


app.get('/enhanced_network_graph_data', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();
    let nodeId = 1;
    let edgeId = 1;

    allData.flatMap(doc =>
      doc["isis-database-information"].flatMap(info =>
        info["isis-database"].flatMap(entry =>
          entry["isis-database-entry"] && entry["isis-database-entry"].forEach(dataEntry => {
            const lspIds = dataEntry["lsp-id"].flatMap((id) => id.data);
            const neighbors = dataEntry["isis-neighbor"].flatMap((n) => n['is-neighbor-id']);
            lspIds.forEach(lspId => {
              if (!nodes.has(lspId)) {
                nodes.set(lspId, {
                  id: `node-${nodeId++}`,
                  position: { x: 0, y: 0 },
                  data: { source: lspId }
                });
              }

              neighbors.forEach(neighbor => {
                if (!nodes.has(neighbor)) {
                  nodes.set(neighbor, {
                    id: `node-${nodeId++}`,
                    position: { x: 0, y: 0 },
                    data: { target: neighbor }
                  });
                }

                const edge = {
                  id: `edge-${edgeId++}`,
                  source: nodes.get(lspId).id,
                  target: nodes.get(neighbor).id
                };
                edges.add(edge);
              });
            });
          })
        )
      )
    );

    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});

app.get('/node_edge_data', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();

    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspId = dataEntry["lsp-id"].flatMap((id) => {
              const match = id.data.match(/^(.*?)\./);
              return match ? match[1] : id.data;  
            })[0];
            
            const neighbors = dataEntry["isis-neighbor"].flatMap((n) => {
              return n['is-neighbor-id'].flatMap(id => {
                const match = id.data.match(/^(.*?)\./);
                return match ? match[1] : id.data;  
              });
            });

            if (!nodes.has(lspId)) {
              nodes.set(lspId, {
                id: `node-${lspId}`,
                position: { x: 0, y: 0 },
                data: { source: lspId }
              });
            }

            neighbors.forEach(neighbor => {
              if (!nodes.has(neighbor)) {
                nodes.set(neighbor, {
                  id: `node-${neighbor}`,
                  position: { x: 0, y: 0 },
                  data: { target: neighbor }
                });
              }

              const edgeId = `edge-${lspId}-${neighbor}`;
              edges.add({
                id: edgeId,
                source: nodes.get(lspId).id,
                target: nodes.get(neighbor).id
              });
            });
          });
        });
      });
    });

    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});

app.get('/node_edge_data2', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-2");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();

    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspId = dataEntry["lsp-id"].flatMap((id) => {
              const match = id.data.match(/^(.*?)\./);
              return match ? match[1] : id.data;  
            })[0];
            
            const neighbors = dataEntry["isis-neighbor"].flatMap((n) => {
              return n['is-neighbor-id'].flatMap(id => {
                const match = id.data.match(/^(.*?)\./);
                return match ? match[1] : id.data;  
              });
            });

            if (!nodes.has(lspId)) {
              nodes.set(lspId, {
                id: `node-${lspId}`,
                position: { x: 0, y: 0 },
                data: { source: lspId }
              });
            }

            neighbors.forEach(neighbor => {
              if (!nodes.has(neighbor)) {
                nodes.set(neighbor, {
                  id: `node-${neighbor}`,
                  position: { x: 0, y: 0 },
                  data: { target: neighbor }
                });
              }

              const edgeId = `edge-${lspId}-${neighbor}`;
              edges.add({
                id: edgeId,
                source: nodes.get(lspId).id,
                target: nodes.get(neighbor).id
              });
            });
          });
        });
      });
    });

    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});


app.get('/node_edge_g62', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-2");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();

    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspId = dataEntry["lsp-id"].flatMap((id) => {
              const match = id.data.match(/^(.*?)\./);
              return match ? match[1] : id.data;  
            })[0];
            
            const neighbors = dataEntry["isis-neighbor"].flatMap((n) => {
              return n['is-neighbor-id'].flatMap(id => {
                const match = id.data.match(/^(.*?)\./);
                return match ? match[1] : id.data;  
              });
            });

            if (!nodes.has(lspId)) {
              nodes.set(lspId, {
                id: `node-${lspId}`,
              });
            }

            neighbors.forEach(neighbor => {
              if (!nodes.has(neighbor)) {
                nodes.set(neighbor, {
                  id: `node-${neighbor}`,
                });
              }

              const edgeId = `edge-${lspId}-${neighbor}`;
              edges.add({
                id: edgeId,
                source: nodes.get(lspId).id,
                target: nodes.get(neighbor).id
              });
            });
          });
        });
      });
    });

    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});

app.get('/node_edge_g6', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const nodes = new Map();
    const edges = new Set();

    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspId = dataEntry["lsp-id"].flatMap((id) => {
              const match = id.data.match(/^(.*?)\./);
              return match ? match[1] : id.data;  
            })[0];
            
            const neighbors = dataEntry["isis-neighbor"].flatMap((n) => {
              return n['is-neighbor-id'].flatMap(id => {
                const match = id.data.match(/^(.*?)\./);
                return match ? match[1] : id.data;  
              });
            });

            if (!nodes.has(lspId)) {
              nodes.set(lspId, {
                id: `node-${lspId}`,
              });
            }

            neighbors.forEach(neighbor => {
              if (!nodes.has(neighbor)) {
                nodes.set(neighbor, {
                  id: `node-${neighbor}`,
                });
              }

              const edgeId = `edge-${lspId}-${neighbor}`;
              edges.add({
                id: edgeId,
                source: nodes.get(lspId).id,
                target: nodes.get(neighbor).id
              });
            });
          });
        });
      });
    });

    res.json({ nodes: Array.from(nodes.values()), edges: Array.from(edges) });
  } catch (error) {
    next(error);
  }
});


app.get('/isis_data', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-1");
    const allData = await db.find({}).toArray();
    const data = [];
    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspIds = dataEntry["lsp-id"].flatMap((id) => id.data);
            lspIds.forEach(lspId => {
              const neighborsData = dataEntry['isis-neighbor'].map((neighbor) => {
                const neighborId = neighbor['is-neighbor-id'].flatMap(id => id.data)[0];
                const metric = neighbor['metric'].flatMap(id => id.data)[0]; 
                return {
                  neighborId: neighborId.split('.')[0],
                  metric: metric
                };
              });

              const lspNeighbors = {
                lspId: lspId.split('.')[0],
                neighbors: neighborsData
              };
              data.push(lspNeighbors);

            });
          });
        });
      });
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

app.get('/isis_data2', async (req, res, next) => {
  try {
    const db = req.app.locals.dbClient.db("isis").collection("data-2");
    const allData = await db.find({}).toArray();
    const data = [];
    allData.flatMap(doc => {
      return doc["isis-database-information"].flatMap(info => {
        return info["isis-database"].flatMap(entry => {
          return entry["isis-database-entry"] && entry["isis-database-entry"].map(dataEntry => {
            const lspIds = dataEntry["lsp-id"].flatMap((id) => id.data);
            lspIds.forEach(lspId => {
              const neighborsData = dataEntry['isis-neighbor'].map((neighbor) => {
                const neighborId = neighbor['is-neighbor-id'].flatMap(id => id.data)[0];
                const metric = neighbor['metric'].flatMap(id => id.data)[0]; 
                return {
                  neighborId: neighborId.split('.')[0],
                  metric: metric
                };
              });

              const lspNeighbors = {
                lspId: lspId.split('.')[0],
                neighbors: neighborsData
              };
              data.push(lspNeighbors);

            });
          });
        });
      });
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
