const crypto = require("node:crypto");

data = [{ id: crypto.randomUUID(), name: "default", price: (Math.random() * 100).toFixed(2) }];

for (let i = 0; i < 10; i++) {
    data.push({ id: crypto.randomUUID(), name: "default", price: (Math.random() * 100).toFixed(2) });
}

console.log(data);