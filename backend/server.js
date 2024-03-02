const http = require("http");
const sqlite3 = require("sqlite3").verbose();

// this code will create a database.
const db = new  sqlite3.Database("datatable.db", (err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Connection established successfully.")
    }
});

db.run(
    `CREATE TABLE IF NOT EXISTS Products(
        ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductName TEXT,
        CategoryID INTEGER,
        Unit TEXT,
        Price FLOAT
    )`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Table created successfully.");
        }
    }
);
  
const search = (callback)=>{
    db.all("SELECT * FROM Products", (err, rows)=>{
        if(err){
            console.error(err);
        }else{
            callback(rows);
        }
    });
};
const insertData = db.prepare(
    `INSERT INTO Products (ProductName, CategoryID, Unit, Price)
    VALUES (?, ?, ?, ?)`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data inserted successfully.");
        }
    }
);

const deleteData = db.prepare(
    `DELETE FROM Products WHERE ProductID == ?`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data deleted successfully.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Products
      SET ProductName = ?,
          CategoryID = ?,
          Unit = ?,
          Price = ?
     WHERE ProductID = ?`,
     (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data modified successfully.");
        }
     }
);

const server = http.createServer((req, res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    search((result)=>{
        res.write(JSON.stringify(result));
        res.end();
    });

    
    if(req.method === "POST"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            insertData.run(
                parsedBody.ProductName,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price
            );
            console.log("Data created successfully.");
        });

        
    }else if(req.method === "DELETE"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            deleteData.run(parsedBody.ProductID);
            console.log("Data deleted successfully.");
        });
    }else if(req.method === "PUT"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            modifyData.run(
                parsedBody.ProductName,
                parsedBody.CategoryID,
                parsedBody.Unit,
                parsedBody.Price,
                parsedBody.ProductID
            );
            console.log("Data modified successfully.");
        });
    }

});
const port = 3000;
server.listen(port);
console.log(`Server listening on port ${port}`);
