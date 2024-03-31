const { promises : fs } = require ('fs')

const path = './Products.json'

export default class ProductManager {
    #products;

    constructor(path) {
        this.path = path;        
        this.#products = [];
    }

/**
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {number} price 
 * @param {string} thumbnail 
 * @param {number} code 
 * @param {number} stock 
 * @returns 
 */

async addProduct(product) {
    try {
        this.#products = await this.readFile();

        if(this.#products.find(p => p.code === product.code)) {            
            console.error("Ya existe un Producto con el Code: " + product.code);
        }else {
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.error("Todos los campos son obligatorios")            
            }else {
                    product.id = this.#getNextId();
                
                this.#products.push(product);
                await fs.writeFile(this.path, JSON.stringify(this.#products, null, '\t'), 'utf-8');
            }
            console.log('Se guardó correctamente el Producto: "' + product.title + '" con el Code: "' + product.code + '"');
        }

    } catch (error) {
        console.error('error: ' + error);
    }   
}

async updateProduct(product) {
    try {
        this.#products = await this.readFile();
        let prodIdx = this.#products.findIndex(p => p.id === product.id);

        if(prodIdx === -1){
            console.error('No se encontró el Producto con el Id: ' + product.id)
        }else{
            this.#products.splice(prodIdx, 1);
            this.#products.push(product);            
            await this.writeFile();
            console.log('Se actualizó correctamente el Producto: "' + product.title + '" con el Code: "' + product.code + '"');
        }

    } catch (error) {
        console.error('error: ' + error)
    }

}

async deleteProduct(id) {
    this.#products = await this.readFile();
    let prodIdx = this.#products.findIndex(p => p.id === id);

    if(prodIdx === -1){
        console.error('No se encontró el Producto con el Id: ' + id)
    }else{
        this.#products.splice(prodIdx, 1);
        await this.writeFile();
        console.log('Se eliminó correctamente el Producto con el Id: "' + id + '"');
    }    
}

async getProducts() {
    return await this.readFile();
}

async getProductById(id) {
    this.#products = await this.readFile();
    const product = this.#products.find((product) => product.id === id);
    if(!product) {
        console.error('No se encontró el Producto con el Id: ' + id)
    }
    return product;
}

async readFile() {
    try {
        
        const productsJson = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(productsJson);
        
    } catch (error) {
        return [];
    }    
}

async writeFile() {
    try {
        await fs.writeFile(this.path, JSON.stringify(this.#products, null, '\t'), 'utf-8');        
    } catch (error) {
        return [];
    }    
}

#getNextId() {
    if(this.#products.length === 0){
        return 1
    }
    return this.#products.at(-1).id + 1
}

}