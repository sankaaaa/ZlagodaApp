const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const cn = {
    connectionString: 'postgres://postgres.qlyuxputrdmikamgcowo:Prka20152020!@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
};
const db = pgp(cn);
//КАСТОМНІ ЗАПИТИ------------------------------------------------------------------------------------------------------
//1 - повертає всі чеки, айді касирів яких НЕ ДОРІВНЮЮТЬ айді користувача, залогіненого в систему, і загальна сума <=15
app.get('/cheque/user/:username', (req, res) => {
    const username = req.params.username;
    db.any(
        `SELECT *
         FROM cheque
         WHERE id_employee NOT IN (
             SELECT id_employee
             FROM employee
             WHERE id_employee = $1
         )
         AND sum_total NOT IN (
             SELECT sum_total
             FROM cheque
             WHERE sum_total >= 15
         );`,
        [username]
    )
        .then(result1 => {
            res.json(result1);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
})
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
app.get('/employee/:id_employee', (req, res) => {
    const categoryNumber = req.params.id_employee;
    db.any('SELECT * FROM employee WHERE id_employee = $1;', [categoryNumber])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.post('/employee', express.json(), (req, res) => {
    const {
        id_employee,
        empl_surname,
        empl_name,
        empl_role,
        salary,
        date_of_birth,
        date_of_start,
        phone_number,
        city,
        street,
        zip_code
    } = req.body;
    db.any('INSERT INTO employee (id_employee, empl_surname, empl_name, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [id_employee, empl_surname, empl_name, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code])
        .then(() => {
            res.json({message: 'Employee added successfully'});
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

//СТОР ПРОДУКТИ---------------------------------------------------------------------------------------------------------
app.get('/store_product', (req, res) => {
    db.any('SELECT * FROM store_product;')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

app.delete('/store_product/:id', (req, res) => {
    const catNum = req.params.id;
    db.none('DELETE FROM store_product WHERE upc = $1', catNum)
        .then(() => {
            res.json({message: 'Store product deleted successfully'});
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
app.get('/cheque/:check_number', (req, res) => {
    const categoryNumber = req.params.check_number;
    db.any('SELECT * FROM product WHERE check_number = $1;', [categoryNumber])
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.delete('/cheque/:id', (req, res) => {
    const catNum = req.params.id;
    db.none('DELETE FROM cheque WHERE check_number = $1', catNum)
        .then(() => {
            res.json({message: 'Cheque deleted successfully'});
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});

//--СЕЙЛИ-----------------------------------------------------------------------------------------------------------------
app.get('/sale', (req, res) => {
    db.any('SELECT * FROM sale;')
        .then(result3 => {
            res.json(result3);
        })
        .catch(error => {
            res.status(500).json({error: error.message});
        });
});
app.delete('/sale/:upc/:checkNumber', (req, res) => {
    const {upc, checkNumber} = req.params;
    db.none('DELETE FROM sale WHERE upc = $1 AND check_number = $2', [upc, checkNumber])
        .then(() => {
            res.json({message: 'Sale deleted successfully'});
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