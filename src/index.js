import fs from 'fs/promises';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
    }

    async consultProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return products;
    }

    async addProduct(product) {
        product.id = 0;
        const products = await this.consultProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        products.push(product);

        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return product;
    }

    async getProducts() {
        const products = await this.consultProducts();
        return products;
    }

    async getProductById(id) {
        const products = await this.consultProducts();
        const productById = products.find(product => product.id === id);

        if (!productById) {
            let error = `Product with ID ${id} not found`;
            return { error };
        } else {
            return productById;
        }
    }

    async updateProduct(id, updatedFields) {
        const products = await this.consultProducts();

        const indexToUpdate = products.findIndex(product => product.id === id);

        if (indexToUpdate === -1) {
            return { error: `Product with ID ${id} not found` };
        }

        Object.assign(products[indexToUpdate], updatedFields);

        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));

        return products[indexToUpdate];
    }

    async deleteProduct(id) {
        const products = await this.consultProducts();

        const indexToDelete = products.findIndex(product => product.id === id);

        if (indexToDelete === -1) {
            return { error: `Product with ID ${id} not found` };
        }

        const deletedProduct = products.splice(indexToDelete, 1)[0];

        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"));

        return deletedProduct;
    }
}

const filePath = './src/products.json';
const productManager = new ProductManager(filePath);

export default ProductManager;

