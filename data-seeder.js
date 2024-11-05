import productModel from './models/product-model.js';
import path from 'path'


const productData = [
  {
    name: 'Cool Water',
    price: 40,
    description:'Cool Water Eau De Toilette for Men',
    suk: 'PF1',
    image: 'http://localhost:9000/perfumes/pf-1.svg',
  },
  {
    name: 'Lataffa',
    description: 'Eau de Parfum',
    price: 80,
    suk: 'PF2',
    image: 'http://localhost:9000/perfumes/sp-2.svg',
  },
  {
    name: 'CK',
    price: 50,
    description: 'Cool Water Eau De Toilette for Men',
    suk: 'PF3',
    image: 'http://localhost:9000/perfumes/sp-3.svg',
  },
  {
    name: 'Lataffa',
    price: 120,
    description: 'Code Le Parfum',
    suk: 'PF4',
    image: 'http://localhost:9000/perfumes/sp-4.svg',
  },
  {
    name: 'Gucci Bloom',
    price: 100,
    description: 'Bloom EDP Intense Eau de Parfum',
    suk: 'PF5',
    image: 'http://localhost:9000/perfumes/sp-5.svg',
  },
  {
    name: 'Chanel No.5',
    price: 150,
    description: 'Eau de Parfum',
    suk: 'PF6',
    image: 'http://localhost:9000/perfumes/sp-6.svg',
  },
];

export async function seedProducts() {
  try {
    for (const data of productData) {
      const product = new productModel({
        name: data.name,
        price: data.price,
        description: data.description,
        suk: data.suk,
        image: data.image,
      });
      await product.save();
      console.log(`Seeded: ${product.name}`);
    }

    console.log('Seeding complete');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
