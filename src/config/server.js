const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const cn = {
    connectionString: 'postgres://postgres.qlyuxputrdmikamgcowo:Prka20152020!@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
};
const db = pgp(cn);

//ПРОДУКТИ-------------------------------------------------------------------------------------------------------------
app.get('/product', (req, res) => {
    db.any('SELECT * FROM product;')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.post('/product', express.json(), (req, res) => {
    const {id_product, product_name, category_number, characteristics} = req.body;
    db.any('INSERT INTO product (id_product, product_name, category_number, characteristics) VALUES ($1, $2, $3, $4)', [id_product, product_name, category_number, characteristics])
        .then(() => {
            res.json({message: 'Product added successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.put('/products/:id', (req, res) => {
    const productNumber = req.params.id;
    const {product_id, product_name, category_number, characteristics} = req.body;
    db.none('UPDATE product SET product_id=$1, product_name=$2, category_number=$3, characteristics=$4 WHERE product_id=$5;',
        [product_id, product_name, category_number, characteristics, productNumber])

        .then(() => {
            res.json({message: 'Product updated successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        })
});
app.delete('/product/:id', (req, res) => {
    const productId = req.params.id;
    db.none('DELETE FROM product WHERE id_product = $1', productId)
        .then(() => {
            res.json({message: 'Product deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

//ПРАЦІВНИКИ-----------------------------------------------------------------------------------------------------------
app.get('/employee', (req, res) => {
    db.any('SELECT * FROM employee;')
        .then(result1 => {
            res.json(result1);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.delete('/employee/:id', (req, res) => {
    const emplID = req.params.id;
    db.none('DELETE FROM employee WHERE id_employee = $1', emplID)
        .then(() => {
            res.json({message: 'Employee deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

//КАТЕГОРІЇ------------------------------------------------------------------------------------------------------------
app.get('/category', (req, res) => {
    db.any('SELECT * FROM category;')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.get('/category/:category_number', (req, res) => {
    const categoryNumber = req.params.category_number;
    db.any('SELECT * FROM product WHERE category_number = $1;', [categoryNumber])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.delete('/category/:id', (req, res) => {
    const catNum = req.params.id;
    db.none('DELETE FROM category WHERE category_number = $1', catNum)
        .then(() => {
            res.json({message: 'Category deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

//КАСТОМЕРИ------------------------------------------------------------------------------------------------------------
app.get('/customer_card', (req, res) => {
    db.any('SELECT * FROM customer_card;')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.delete('/customer_card/:id', (req, res) => {
    const catNum = req.params.id;
    db.none('DELETE FROM customer_card WHERE card_number = $1', catNum)
        .then(() => {
            res.json({message: 'Customer deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

//ЧЕКИ-----------------------------------------------------------------------------------------------------------------
app.get('/cheque', (req, res) => {
    db.any('SELECT * FROM cheque;')
        .then(result2 => {
            res.json(result2);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.get('/sale', (req, res) => {
    db.any('SELECT * FROM sale;')
        .then(result3 => {
            res.json(result3);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

const PORT = 8081
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});